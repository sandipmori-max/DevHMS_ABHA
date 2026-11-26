import {
  generateGUID,
  getErrorMessage,
  M2_CALLBACK_API_BASE_URL,
  M3_BASE_URL_API_HIP,
} from "../../utils/helpers";
import {
  logAbhaApiRequest,
  logAbhaApiResponse,
} from "../../utils/apiLogging";
import { baseApi } from "./baseApi";
import { END_POINTS } from "./end_points";

export interface ConsentRequestPayload {
  consent: {
    purpose: {
      text: string;
      code: string;
      refUri: string;
    };
    patient: {
      id: string;
    };
    hiu: {
      id: string;
    };
    hip: { id: string } | null;
    careContexts: {
      patientReference: string;
      careContextReference: string;
    }[] | null;
    requester: {
      name: string;
      identifier: {
        type: string;
        value: string;
        system: string;
      };
    };
    hiTypes: string[];
    permission: {
      accessMode: string;
      dateRange: {
        from: string;
        to: string;
      };
      dataEraseAt: string;
      frequency: {
        unit: "HOUR" | "DAY" | "WEEK" | "MONTH";
        value: number;
        repeats: number;
      };
    };
  };
}

export interface ConsentRequestResult {
  requestId: string;
  pollId: string;
  status: "PENDING";
}

export interface ConsentRequestStatusResult {
  status: "PENDING" | "REQUESTED" | "GRANTED" | "DENIED" | "EXPIRED" | "REVOKED" | "FAILED";
  consentRequestId?: string;
  consentArtefactIds: string[];
  error?: string;
}

export interface FhirResource {
  resourceType?: string;
  title?: string;
  date?: string;
  authoredOn?: string;
  effectiveDateTime?: string;
  entry?: { resource?: FhirResource }[];
  code?: {
    text?: string;
    coding?: { display?: string }[];
  };
  valueString?: string;
  valueQuantity?: { value?: number; unit?: string };
}

export type FhirBundle = FhirResource;

export interface ConsentDataFetchResult {
  status:
    | "FETCHING_CONSENT"
    | "REQUESTING_DATA"
    | "RECEIVING"
    | "COMPLETED"
    | "FAILED"
    | "REVOKED";
  error?: string;
  consent?: {
    consentId: string;
    patientId: string;
    hipId: string;
    hiuId: string;
    hiTypes: string[];
    accessMode: string;
    from: string;
    to: string;
    dataEraseAt?: string;
  };
  records: FhirBundle[];
}

export interface ConsentDataFetchRequest {
  pollId: string;
  consentArtefactId: string;
}

interface CallbackApiResponse<T> {
  response: Response;
  data: T | null;
}

interface CallbackApiMessage {
  message?: string;
  error?: string;
  detail?: string;
}

interface CreatedConsentRequest {
  requestId?: string;
  pollId?: string;
  message?: string;
}

const CONSENT_REQUEST_PATH = "/mobile/abdm/consent-requests";
const CONSENT_POLL_PATH = `${CONSENT_REQUEST_PATH}/poll`;
const CONSENT_CANCEL_PATH = `${CONSENT_REQUEST_PATH}/cancel`;
const CONSENT_DATA_PATH = "/mobile/abdm/consent-data";

const getCallbackPath = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.origin}${parsedUrl.pathname}`;
  } catch {
    return url.split("?")[0];
  }
};

const postCallbackApi = async <T,>(
  url: string,
  body: object,
  signal?: AbortSignal,
): Promise<CallbackApiResponse<T>> => {
  const endpoint = getCallbackPath(url);
  logAbhaApiRequest("POST", endpoint, JSON.stringify(body));

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
    console.error("[ABHA callback] Network failure", endpoint, {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    throw error;
  }

  const text = await response.text();
  logAbhaApiResponse("POST", endpoint, response.status, response.ok);
  if (!text) {
    return { response, data: null };
  }

  try {
    return { response, data: JSON.parse(text) as T };
  } catch {
    throw new Error("The callback server returned an invalid response.");
  }
};

const getCallbackErrorMessage = (
  data: CallbackApiMessage | null,
  status: number,
) =>
  data?.message?.trim() ||
  data?.error?.trim() ||
  data?.detail?.trim() ||
  `The callback server returned HTTP ${status}.`;

export const getSafeConsentRequestErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const errorRecord = error as Record<string, unknown>;
    const data =
      typeof errorRecord.data === "object" && errorRecord.data !== null
        ? errorRecord.data as Record<string, unknown>
        : undefined;
    for (const candidate of [
      data?.message,
      data?.detail,
      data?.error,
      errorRecord.error,
    ]) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  return "The callback server request failed.";
};

const cancelConsentRequest = async (requestId: string) => {
  try {
    const { response, data } = await postCallbackApi<CallbackApiMessage>(
      `${M2_CALLBACK_API_BASE_URL}${CONSENT_CANCEL_PATH}`,
      { requestId },
    );

    return response.ok || response.status === 404
      ? undefined
      : getCallbackErrorMessage(data, response.status);
  } catch {
    return "The callback server could not confirm consent-request cancellation.";
  }
};

export const consentRequestApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    consentRequest: builder.mutation<ConsentRequestResult, ConsentRequestPayload>({
      async queryFn(body, api, _extraOptions, baseQuery) {
        if (!M2_CALLBACK_API_BASE_URL) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Configure ABDM_CALLBACK_API_BASE_URL before creating consent requests.",
            },
          };
        }

        const requestId = generateGUID();
        let isRegistered = false;

        try {
          const createdRequest = await postCallbackApi<CreatedConsentRequest>(
            `${M2_CALLBACK_API_BASE_URL}${CONSENT_REQUEST_PATH}`,
            {
              requestId,
              patientAddress: body.consent.patient.id,
              hiuId: body.consent.hiu.id,
            },
            api.signal,
          );
          if (
            createdRequest.response.status !== 201 ||
            createdRequest.data?.requestId !== requestId ||
            !createdRequest.data.pollId
          ) {
            throw new Error(
              getCallbackErrorMessage(
                createdRequest.data,
                createdRequest.response.status,
              ),
            );
          }
          isRegistered = true;

          const result = await baseQuery({
            url: `${M3_BASE_URL_API_HIP}${END_POINTS.consentRequestInit}`,
            method: "POST",
            body,
            headers: {
              "X-CM-ID": "sbx",
              "X-HIU-ID": body.consent.hiu.id,
              "REQUEST-ID": requestId,
            },
          });

          if (result.error) {
            const cancelMessage = await cancelConsentRequest(requestId);
            return {
              error: cancelMessage
                ? {
                    status: "CUSTOM_ERROR",
                    error: `${getErrorMessage(result.error)} ${cancelMessage}`,
                  }
                : result.error,
            };
          }

          return {
            data: {
              requestId,
              pollId: createdRequest.data.pollId,
              status: "PENDING",
            },
          };
        } catch (error) {
          const cancelMessage = isRegistered
            ? await cancelConsentRequest(requestId)
            : undefined;
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error
                  ? cancelMessage
                    ? `${error.message} ${cancelMessage}`
                    : error.message
                  : getErrorMessage(error),
            },
          };
        }
      },
    }),

    pollConsentRequestStatus: builder.mutation<
      ConsentRequestStatusResult,
      string
    >({
      async queryFn(pollId, api) {
        if (!M2_CALLBACK_API_BASE_URL) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Configure ABDM_CALLBACK_API_BASE_URL before checking consent status.",
            },
          };
        }

        try {
          const result = await postCallbackApi<ConsentRequestStatusResult>(
            `${M2_CALLBACK_API_BASE_URL}${CONSENT_POLL_PATH}`,
            { pollId },
            api.signal,
          );

          if (
            result.response.status === 202 &&
            result.data?.status === "PENDING"
          ) {
            return {
              data: {
                status: "PENDING",
                consentArtefactIds: [],
              },
            };
          }

          if (result.response.ok && result.data?.status) {
            return {
              data: {
                ...result.data,
                consentArtefactIds: result.data.consentArtefactIds ?? [],
              },
            };
          }

          return {
            error: {
              status: "CUSTOM_ERROR",
              error: getCallbackErrorMessage(result.data, result.response.status),
            },
          };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: getSafeConsentRequestErrorMessage(error),
            },
          };
        }
      },
    }),
  }),
});

export const consentDataApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    startConsentDataFetch: builder.mutation<
      ConsentDataFetchResult,
      ConsentDataFetchRequest
    >({
      async queryFn(body, _api) {
        if (!M2_CALLBACK_API_BASE_URL) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Configure ABDM_CALLBACK_API_BASE_URL before fetching health records.",
            },
          };
        }

        try {
          const result = await postCallbackApi<ConsentDataFetchResult>(
            `${M2_CALLBACK_API_BASE_URL}${CONSENT_DATA_PATH}/start`,
            body,
          );
          if (result.response.status === 202 && result.data) {
            return { data: result.data };
          }

          return {
            error: {
              status: "CUSTOM_ERROR",
              error: getCallbackErrorMessage(result.data, result.response.status),
            },
          };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: getSafeConsentRequestErrorMessage(error),
            },
          };
        }
      },
    }),
    pollConsentDataFetch: builder.mutation<
      ConsentDataFetchResult,
      ConsentDataFetchRequest
    >({
      async queryFn(body, _api) {
        if (!M2_CALLBACK_API_BASE_URL) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Configure ABDM_CALLBACK_API_BASE_URL before checking health records.",
            },
          };
        }

        try {
          const result = await postCallbackApi<ConsentDataFetchResult>(
            `${M2_CALLBACK_API_BASE_URL}${CONSENT_DATA_PATH}/poll`,
            body,
          );
          if (result.response.ok && result.data) {
            return { data: result.data };
          }

          return {
            error: {
              status: "CUSTOM_ERROR",
              error: getCallbackErrorMessage(result.data, result.response.status),
            },
          };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: getSafeConsentRequestErrorMessage(error),
            },
          };
        }
      },
    }),
  }),
});

export const {
  useConsentRequestMutation,
  usePollConsentRequestStatusMutation,
} = consentRequestApi;

export const {
  useStartConsentDataFetchMutation,
  usePollConsentDataFetchMutation,
} = consentDataApi;
