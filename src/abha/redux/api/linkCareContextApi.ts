import {
  generateGUID,
  getErrorMessage,
  M2_BASE_URL_API_HIP,
  M2_CALLBACK_API_BASE_URL,
} from '../../utils/helpers';
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
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  });
  const text = await response.text();

  if (!text) {
    return { response, data: null };
  }

  try {
    return { response, data: JSON.parse(text) as T };
  } catch {
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