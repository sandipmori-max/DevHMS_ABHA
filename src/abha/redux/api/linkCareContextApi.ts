import {
  generateGUID,
  getErrorMessage,
  M2_BASE_URL_API_HIP,
  M2_CALLBACK_API_BASE_URL,
} from '../../utils/helpers';
import {
  logAbhaApiRequest,
  logAbhaApiResponse,
} from '../../utils/apiLogging';
import { showToast } from '../../utils/toast';
import { baseApi } from './baseApi';
import { END_POINTS } from './end_points';

const CARE_CONTEXT_REQUEST_PATH = '/mobile/abdm/care-context-requests';
const CARE_CONTEXT_POLL_PATH = `${CARE_CONTEXT_REQUEST_PATH}/poll`;
const CARE_CONTEXT_CANCEL_PATH = `${CARE_CONTEXT_REQUEST_PATH}/cancel`;

// ==================== REQUEST ====================

export interface CareContext {
  referenceNumber: string;
  display: string;
}

export interface PatientCareContext {
  referenceNumber: string;
  display: string;
  careContexts: CareContext[];
  hiType: string;
  count: number;
}

export interface LinkCareContextPayload {
  abhaNumber: string;
  abhaAddress: string;
  patient: PatientCareContext[];
}

// ==================== RESPONSE ====================

export interface LinkCareContextResponse {
  response: {
    requestId: string;
  };
}

export interface CareContextLinkStatusResponse {
  requestId: string;
  status: 'pending' | 'completed';
  linkStatus?: string;
  error?: string;
}

interface CallbackApiResponse<T> {
  response: Response;
  data: T | null;
}

interface CallbackApiMessage {
  message?: string;
}

interface CallbackApiRequest {
  requestId?: string;
  message?: string;
}

interface CareContextCallbackStatus {
  status?: 'pending' | 'completed';
  linkStatus?: string;
  error?: string;
  message?: string;
}

const postCallbackApi = async <T>(
  url: string,
  body: object,
  signal?: AbortSignal,
): Promise<CallbackApiResponse<T>> => {
  const endpoint = (() => {
    try {
      const parsedUrl = new URL(url);
      return `${parsedUrl.origin}${parsedUrl.pathname}`;
    } catch {
      return url.split('?')[0];
    }
  })();
  logAbhaApiRequest('POST', endpoint, JSON.stringify(body));

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    console.error('[ABHA callback] Network failure', endpoint, {
      name: error instanceof Error ? error.name : 'UnknownError',
    });
    throw error;
  }

  const text = await response.text();
  logAbhaApiResponse('POST', endpoint, response.status, response.ok);

  if (!text) {
    return { response, data: null };
  }

  try {
    const data = JSON.parse(text) as T;
    const responseSummary =
      data && typeof data === 'object'
        ? {
            status: 'status' in data ? data.status : undefined,
            hasRequestId: 'requestId' in data,
          }
        : undefined;
    if (responseSummary) {
      console.log('[ABHA callback] Response summary', endpoint, responseSummary);
    }
    return { response, data };
  } catch {
    console.error('[ABHA callback] Invalid JSON response', endpoint);
    throw new Error('The callback server returned an invalid response.');
  }
};

const getCallbackErrorMessage = (
  data: CallbackApiMessage | null,
  status: number,
) => data?.message?.trim() || `The callback server returned HTTP ${status}.`;

const cancelCareContextRequest = async (requestId: string) => {
  try {
    const { response, data } = await postCallbackApi<CallbackApiMessage>(
      `${M2_CALLBACK_API_BASE_URL}${CARE_CONTEXT_CANCEL_PATH}`,
      { requestId },
    );

    return response.ok || response.status === 404
      ? undefined
      : getCallbackErrorMessage(data, response.status);
  } catch {
    return 'The callback server could not confirm request cancellation.';
  }
};

export const careContextLinkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    linkCareContext: builder.mutation<
      LinkCareContextResponse,
      LinkCareContextPayload
    >({
      async queryFn(body, api, _extraOptions, baseQuery) {
        if (!M2_CALLBACK_API_BASE_URL) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Configure ABDM_CALLBACK_API_BASE_URL before linking care contexts.',
            },
          };
        }

        const state: any = api.getState();
        const linkToken = state?.abha?.linkToken;
        const selectedXCMID = state?.abha?.selectedXCMID;
        if (!linkToken || !selectedXCMID) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'A link token and HIP service are required before linking care contexts.',
            },
          };
        }
        const tokenExpiresAt = Date.parse(
          state?.abha?.linkTokenExpiresAt || '',
        );
        if (!Number.isFinite(tokenExpiresAt) || tokenExpiresAt <= Date.now()) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'The link token has expired. Return to Bridge Services to generate a new one.',
            },
          };
        }
        if (
          state?.abha?.linkTokenHipId !== String(selectedXCMID) ||
          String(state?.abha?.linkTokenAbhaAddress || '').toLowerCase() !==
            body.abhaAddress.toLowerCase() ||
          String(state?.abha?.linkTokenAbhaNumber || '').replace(/\D/g, '') !==
            String(body.abhaNumber).replace(/\D/g, '')
        ) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'The link token does not match this patient and HIP service. Generate a new token from Bridge Services.',
            },
          };
        }

        const requestId = generateGUID();
        let isRegistered = false;

        try {
          const createdRequest = await postCallbackApi<CallbackApiRequest>(
            `${M2_CALLBACK_API_BASE_URL}${CARE_CONTEXT_REQUEST_PATH}`,
            { requestId, abhaAddress: body.abhaAddress },
            api.signal,
          );
          if (
            createdRequest.response.status !== 201 ||
            createdRequest.data?.requestId !== requestId
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
            url: `${M2_BASE_URL_API_HIP}${END_POINTS.linkCareContext}`,
            method: 'POST',
            body,
            headers: {
              'X-HIP-ID': selectedXCMID,
              'X-CM-ID': 'sbx',
              'X-LINK-TOKEN': linkToken,
              'REQUEST-ID': requestId,
            },
          });

          if (result.error) {
            const cancelMessage = await cancelCareContextRequest(requestId);
            return {
              error: cancelMessage
                ? {
                    status: 'CUSTOM_ERROR',
                    error: `${getErrorMessage(result.error)} ${cancelMessage}`,
                  }
                : result.error,
            };
          }

          return { data: { response: { requestId } } };
        } catch (error) {
          const cancelMessage = isRegistered
            ? await cancelCareContextRequest(requestId)
            : undefined;
          return {
            error: {
              status: 'CUSTOM_ERROR',
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
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          showToast(
            'success',
            'Link request accepted',
            'Waiting for ABDM to confirm the care-context link.',
          );
        } catch (error) {
          showToast('error', 'Link Request Failed', getErrorMessage(error));
        }
      },
    }),

    pollCareContextLinkStatus: builder.mutation<
      CareContextLinkStatusResponse,
      string
    >({
      async queryFn(requestId, api) {
        if (!M2_CALLBACK_API_BASE_URL) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Configure ABDM_CALLBACK_API_BASE_URL before checking link status.',
            },
          };
        }

        try {
          const result = await postCallbackApi<CareContextCallbackStatus>(
            `${M2_CALLBACK_API_BASE_URL}${CARE_CONTEXT_POLL_PATH}`,
            { requestId },
            api.signal,
          );

          if (
            result.response.status === 202 &&
            result.data?.status === 'pending'
          ) {
            return {
              data: { requestId, status: 'pending' },
            };
          }

          if (
            result.response.ok &&
            result.data?.status === 'completed' &&
            result.data.linkStatus
          ) {
            return {
              data: {
                requestId,
                status: 'completed',
                linkStatus: result.data.linkStatus,
                error: result.data.error,
              },
            };
          }

          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: getCallbackErrorMessage(result.data, result.response.status),
            },
          };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : getErrorMessage(error),
            },
          };
        }
      },
    }),
  }),
});

export const {
  useLinkCareContextMutation,
  usePollCareContextLinkStatusMutation,
} = careContextLinkApi;