import {
  generateGUID,
  getErrorMessage,
  M2_BASE_URL_API,
  M2_CALLBACK_API_BASE_URL,
} from "../../utils/helpers";
import {
  logAbhaApiRequest,
  logAbhaApiResponse,
} from "../../utils/apiLogging";
import {
  getSavePagePayload,
  savePageApi,
} from "./savePageApi";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

export interface GenerateLinkTokenPayload {
  abhaNumber: number;
  abhaAddress: string;
  name: string;
  gender: "M" | "F" | "O";
  yearOfBirth: number;
}

export interface GenerateLinkTokenResponse {
  status: "ready";
  linkToken: string;
  transactionId: string;
  expiresAt: string;
}

interface CreatedTokenRequest {
  requestId?: string;
  message?: string;
}

interface PolledTokenRequest {
  status?: "pending" | "ready";
  linkToken?: string;
  expiresAt?: string;
  message?: string;
}

interface CallbackApiError {
  message?: string;
}

const TOKEN_REQUEST_PATH = "/mobile/abdm/link-token-requests";
const TOKEN_POLL_PATH = `${TOKEN_REQUEST_PATH}/poll`;
const TOKEN_CANCEL_PATH = `${TOKEN_REQUEST_PATH}/cancel`;
const TOKEN_POLL_TIMEOUT_MS = 60_000;
const TOKEN_POLL_INTERVAL_MS = 1_000;

const readJsonResponse = async <T>(
  response: Response,
): Promise<T | null> => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("The callback server returned an invalid response.");
  }
};

const getCallbackPath = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.origin}${parsedUrl.pathname}`;
  } catch {
    return url.split("?")[0];
  }
};

const postCallbackApi = async <T>(
  url: string,
  body: object,
  signal?: AbortSignal,
) => {
  const path = getCallbackPath(url);
  logAbhaApiRequest("POST", path, JSON.stringify(body));

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    console.error("[ABHA callback] Network failure", path, {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    throw error;
  }

  logAbhaApiResponse("POST", path, response.status, response.ok);
  const data = await readJsonResponse<T>(response);
  const responseSummary =
    data && typeof data === "object"
      ? {
          status: "status" in data ? data.status : undefined,
          hasRequestId: "requestId" in data,
          hasLinkToken: "linkToken" in data,
        }
      : undefined;
  if (responseSummary) {
    console.log("[ABHA callback] Response summary", path, responseSummary);
  }
  return {
    response,
    data,
  };
};

const getCallbackErrorMessage = (
  data: CallbackApiError | null,
  status: number,
) =>
  data?.message?.trim() ||
  `The callback server returned HTTP ${status}.`;

const getLinkRequestErrorMessage = (error: unknown) => {
  if (error && typeof error === "object" && "error" in error) {
    const queryError = error.error;
    if (typeof queryError === "string") {
      return queryError;
    }

    if (
      queryError &&
      typeof queryError === "object" &&
      "error" in queryError &&
      typeof queryError.error === "string"
    ) {
      return queryError.error;
    }
  }

  return getErrorMessage(error);
};

const cancelTokenRequest = async (
  callbackApiBaseUrl: string,
  requestId: string,
): Promise<string | undefined> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3_000);

  try {
    const { response, data } = await postCallbackApi<CallbackApiError>(
      `${callbackApiBaseUrl}${TOKEN_CANCEL_PATH}`,
      { requestId },
      controller.signal,
    );

    if (response.ok || response.status === 404) {
      return undefined;
    }

    return `${getCallbackErrorMessage(data, response.status)} The pending request will expire automatically.`;
  } catch {
    return "The server could not confirm cancellation; the pending request will expire automatically.";
  } finally {
    clearTimeout(timeout);
  }
};

const waitForNextPoll = (signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error("Token request was cancelled."));
      return;
    }

    const onAbort = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
      reject(new Error("Token request was cancelled."));
    };

    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, TOKEN_POLL_INTERVAL_MS);

    signal.addEventListener("abort", onAbort, { once: true });
  });

export const linkAbhaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateLinkToken: builder.mutation<
      GenerateLinkTokenResponse,
      GenerateLinkTokenPayload
    >({
      async queryFn(body, api, _extraOptions, baseQuery) {
        if (!M2_CALLBACK_API_BASE_URL) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                "Configure ABDM_CALLBACK_API_BASE_URL with a URL reachable by the mobile app. Use a public HTTPS URL for live ABDM callbacks.",
            },
          };
        }

        if (!body.abhaAddress?.trim()) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "ABHA address is required to receive the token callback.",
            },
          };
        }

        const state = api.getState() as {
          abha?: { selectedXCMID?: string };
          auth?: { user?: { token?: string } | null };
        };
        const hipId = state.abha?.selectedXCMID;
        if (!hipId) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Select a HIP service before generating a link token.",
            },
          };
        }

        let mobileRequestId: string | undefined;
        const abdmRequestId = generateGUID();
        console.log("[ABHA M2] Link-token flow started");

        try {
          const createdRequest = await postCallbackApi<CreatedTokenRequest>(
            `${M2_CALLBACK_API_BASE_URL}${TOKEN_REQUEST_PATH}`,
            {
              abhaAddress: body.abhaAddress.trim(),
              abdmRequestId,
            },
            api.signal,
          );

          if (
            createdRequest.response.status !== 201 ||
            !createdRequest.data?.requestId
          ) {
            throw new Error(
              getCallbackErrorMessage(
                createdRequest.data,
                createdRequest.response.status,
              ),
            );
          }

          mobileRequestId = createdRequest.data.requestId;
          console.log("[ABHA M2] Callback request registered");

          const abdmResult = await baseQuery({
            url: `${M2_BASE_URL_API}${END_POINTS.generateLinkToken}`,
            method: "POST",
            body,
            headers: {
              "X-HIP-ID": hipId,
              "X-CM-ID": "sbx",
              "REQUEST-ID": abdmRequestId,
            },
          });

          console.log("[ABHA M2] ABDM generate-token completed", {
            success: !abdmResult.error,
          });

          if (abdmResult.error) {
            const cancelMessage = await cancelTokenRequest(
              M2_CALLBACK_API_BASE_URL,
              mobileRequestId,
            );
            if (cancelMessage) {
              return {
                error: {
                  status: "CUSTOM_ERROR",
                  error: `${getErrorMessage(abdmResult.error)} ${cancelMessage}`,
                },
              };
            }

            return { error: abdmResult.error };
          }

          const deadline = Date.now() + TOKEN_POLL_TIMEOUT_MS;
          let pollCount = 0;
          console.log("[ABHA M2] Waiting for token callback");
          while (Date.now() < deadline) {
            pollCount += 1;
            const pollResult = await postCallbackApi<PolledTokenRequest>(
              `${M2_CALLBACK_API_BASE_URL}${TOKEN_POLL_PATH}`,
              { requestId: mobileRequestId },
              api.signal,
            );

            if (
              pollResult.response.status === 202 &&
              pollResult.data?.status === "pending"
            ) {
              if (pollCount === 1 || pollCount % 5 === 0) {
                console.log("[ABHA M2] Callback still pending", {
                  pollCount,
                });
              }
              await waitForNextPoll(api.signal);
              continue;
            }

            if (
              pollResult.response.ok &&
              pollResult.data?.status === "ready" &&
              pollResult.data.linkToken
            ) {
              const erpToken = state.auth?.user?.token;
              if (!erpToken) {
                throw new Error(
                  "ERP user session is unavailable to save the generated link token.",
                );
              }

              const tokenPageData = {
                "tgid": "",
                ...body,
                status: pollResult.data.status,
                linktoken: pollResult.data.linkToken,
                expiresat: pollResult.data.expiresAt ?? "",
              };
              console.log("[ABHA M2] Saving link token to ERP server", {
                hasSessionToken: Boolean(erpToken),
                hasLinkToken: Boolean(tokenPageData.linktoken),
              });
              await api.dispatch(
                savePageApi.endpoints.savePage.initiate(
                  getSavePagePayload(
                    erpToken,
                    "TokenGenerate",
                    JSON.stringify(tokenPageData),
                  ),
                ),
              ).unwrap();

              return {
                data: {
                  status: "ready",
                  linkToken: pollResult.data.linkToken,
                  transactionId: abdmRequestId,
                  expiresAt: pollResult.data.expiresAt ?? "",
                },
              };
            }

            throw new Error(
              getCallbackErrorMessage(
                pollResult.data,
                pollResult.response.status,
              ),
            );
          }

          throw new Error(
            "Timed out waiting for the ABDM token callback. Try generating a new token.",
          );
        } catch (error) {
          const cancelMessage = mobileRequestId
            ? await cancelTokenRequest(
                M2_CALLBACK_API_BASE_URL,
                mobileRequestId,
              )
            : undefined;
          const message = api.signal.aborted
            ? "Token request was cancelled."
            : error instanceof Error
              ? error.message
              : getErrorMessage(error);

          console.error("[ABHA M2] Link-token flow failed", {
            name: error instanceof Error ? error.name : "UnknownError",
          });

          return {
            error: {
              status: "CUSTOM_ERROR",
              error: cancelMessage ? `${message} ${cancelMessage}` : message,
            },
          };
        }
      },

      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          showToast(
            "success",
            "Link token received",
            "ABDM callback received. Continue to link care contexts.",
          );
        } catch (error) {
          showToast(
            "error",
            "Link Request Failed",
            getLinkRequestErrorMessage(error),
          );
        }
      },
    }),
  }),
});

export const { useGenerateLinkTokenMutation } = linkAbhaApi;
