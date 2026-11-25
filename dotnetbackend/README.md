# DevHMS ABDM callback API

This .NET 8 service receives callbacks used by ABDM M2 HIP linking and M3 HIU
consent requests, and answers user-initiated care-context discovery.

## Callback routes

Configure the registered HIP bridge URL as the public HTTPS base URL only
(without an API path). ABDM appends the callback route:

- `POST /api/v3/hip/token/on-generate-token`
- `POST /api/v3/link/on_carecontext`
- `POST /api/v3/hip/patient/care-context/discover`
- `POST /api/v3/hiu/consent/request/on-init`
- `POST /api/v3/hiu/consent/request/notify`

The token callback is matched against the ABHA address and the `REQUEST-ID`
sent with the mobile app's ABDM `generate-token` call. The token is retained
for up to 10 minutes and can be retrieved once using
`POST /mobile/abdm/link-token-requests/poll`.

The care-context callback is matched against the ABHA address and the
`REQUEST-ID` sent with `POST /api/hiecm/hip/v3/link/carecontext`. Its `status`
is the final outcome; the `202` response from the link call only means ABDM
accepted the request. The callback is acknowledged with `200 OK`.

The discovery callback is acknowledged with `202 Accepted` and handled by a
background worker. The worker obtains an ABDM gateway session token, matches
the request against the configured sandbox demo patient's verified ABHA number
or address plus name, gender, and year of birth, and posts the unlinked demo
care contexts to the ABDM `on-discover` endpoint. Requests that do not match
the configured demo patient receive an ABDM no-match response; no demo records
are returned for other patients.

## Sandbox discovery configuration

Configure these environment variables on the .NET host. Keep the client secret
out of source control and use the same sandbox client credentials as the
mobile app:

- `ABDM_CLIENT_ID`
- `ABDM_CLIENT_SECRET`
- `ABDM_CM_ID` (defaults to `sbx`)
- `ABDM_HIP_ID`
- `ABDM_DEMO_ABHA_NUMBER`
- `ABDM_DEMO_ABHA_ADDRESS`
- `ABDM_DEMO_PATIENT_NAME`
- `ABDM_DEMO_PATIENT_GENDER`
- `ABDM_DEMO_PATIENT_YEAR_OF_BIRTH`
- `ABDM_DEMO_PATIENT_REFERENCE` (optional; defaults to `DEMO-PATIENT-001`)
- `ABDM_SESSION_URL` and `ABDM_ON_DISCOVER_URL` (optional sandbox endpoint overrides)

The demo care-context references are fixed sandbox fixtures. Replace the
in-memory matcher and fixture contexts with the hospital's patient/encounter
repository before production use. This callback queue, duplicate tracking, and
the existing token/care-context callback state are in memory and are not
multi-instance or restart-safe.

## Consent request flow (HIU)

The mobile app registers a request with
`POST /mobile/abdm/consent-requests`, then sends
`POST /api/hiecm/consent/v3/request/init` to ABDM. The patient reviews the
request in the ABHA app. The bridge stores the `consentRequest.id` from
`/api/v3/hiu/consent/request/on-init` and exposes request/decision state through
`POST /mobile/abdm/consent-requests/poll`. After the patient grants, denies,
revokes, or the request expires, ABDM calls
`/api/v3/hiu/consent/request/notify`; the bridge stores the status and all
consent-artefact IDs, then acknowledges the notification with ABDM.

The mobile app registers the selected active HIU service ID with each request.
The callback server binds the `X-HIU-ID` on init and notify callbacks to that
request and uses the same ID when acknowledging notifications. No single
`ABDM_HIU_ID` setting is required. Set `ABDM_CLIENT_ID` and
`ABDM_CLIENT_SECRET` on the .NET host so it can obtain/refresh its own gateway
session token and acknowledge notifications. The app and .NET service each
need the sandbox client credentials in their respective environment; do not
put the secret in source control.

On the mobile build, set `ABDM_CALLBACK_API_BASE_URL`,
`ABDM_CLIENT_ID`, and `ABDM_CLIENT_SECRET` in the root `.env`. Also configure
`ABDM_REQUESTER_IDENTIFIER_TYPE`, `ABDM_REQUESTER_IDENTIFIER_VALUE`, and
`ABDM_REQUESTER_IDENTIFIER_SYSTEM` with the hospital's real registered
identifier; the form will reject submission if those values are missing.
Rebuild the app after changing `.env`. React Native environment values are
packaged into the app, so keep this client-credentials flow sandbox-only;
production client secrets must stay on the backend.

The mobile status poll ID is a random bearer capability; keep it private and do
not log it. Consent callback state is in memory for up to 24 hours, so deploy
durable shared storage before production use. Fetching consent artefacts and
transferring health records are separate later steps and are not implemented
by the consent form.

## Mobile handoff

1. The app creates a short-lived request with
   `POST /mobile/abdm/link-token-requests`, sending the ABHA address and the
   request ID it will use for ABDM. It receives a random 256-bit poll ID.
2. The app calls ABDM's `generate-token` endpoint with that request ID.
3. ABDM posts the token to the HIP callback route above.
4. The app polls `POST /mobile/abdm/link-token-requests/poll` with the mobile
   poll ID. The API returns `202` while waiting, then returns the token once.
5. Failed or timed-out mobile requests are cancelled through
   `POST /mobile/abdm/link-token-requests/cancel`.
6. Before linking care contexts, the app registers the link request ID with
   `POST /mobile/abdm/care-context-requests`.
7. After ABDM accepts the care-context request, the app polls
   `POST /mobile/abdm/care-context-requests/poll`. The API returns `202` while
   pending, then the callback status when ABDM sends `/api/v3/link/on_carecontext`.

The poll ID is a one-time bearer capability. Do not log, share, or put it in
URLs. Copy `.env.example` to `.env` and set
`ABDM_CALLBACK_API_BASE_URL` to a URL the mobile app can reach. Configure the
ABDM bridge URL to the public HTTPS base URL without a path. ABDM appends
`/api/v3/hip/token/on-generate-token` when sending the token callback. Rebuild
the mobile app after changing `.env`.

## Local development

```sh
dotnet run --project dotnetbackend/DevHms.Abdm.CallbackApi.csproj
```

For mobile-to-API testing without a tunnel, set
`ABDM_CALLBACK_API_BASE_URL` in the app's root `.env` to a host reachable from
the app:

- iOS Simulator: `http://localhost:5162`
- Android Emulator: `http://10.0.2.2:5162`
- Physical device for local-only API testing: run
  `dotnet run --urls http://0.0.0.0:5162`, then set the app URL to
  `http://<mac-lan-ip>:5162` (phone and Mac must be on the same Wi-Fi)

These local URLs let the app reach the API, but ABDM cannot call them. For the
real callback flow, expose the local API through a public HTTPS tunnel, set the
tunnel base URL in `.env`, and register that base URL (without an API path) with
ABDM. For a physical device, using
the HTTPS tunnel URL in the app also avoids local HTTP network restrictions.
Rebuild the app after changing `.env`.

The in-memory callback store is intended for local development and sandbox
integration only. It loses pending requests and tokens on restart. The mobile
request endpoint also needs the app's normal authentication and rate limiting
before production use. Deploy behind HTTPS and add durable storage and the
deployment's callback-verification controls before production use.
