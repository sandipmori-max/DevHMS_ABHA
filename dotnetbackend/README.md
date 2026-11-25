# DevHMS ABDM callback API

This .NET 8 service receives the asynchronous callbacks used by the ABDM M2
HIP-initiated linking flow.

## Callback routes

Configure the registered HIP bridge URL as the public HTTPS base URL only
(without an API path). ABDM appends the callback route:

- `POST /api/v3/hip/token/on-generate-token`
- `POST /api/v3/link/on_carecontext`

The token callback is matched against the ABHA address and the `REQUEST-ID`
sent with the mobile app's ABDM `generate-token` call. The token is retained
for up to 10 minutes and can be retrieved once using
`POST /mobile/abdm/link-token-requests/poll`.

The care-context callback is matched against the ABHA address and the
`REQUEST-ID` sent with `POST /api/hiecm/hip/v3/link/carecontext`. Its `status`
is the final outcome; the `202` response from the link call only means ABDM
accepted the request. The callback is acknowledged with `200 OK`.

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
