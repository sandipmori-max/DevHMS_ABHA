import {
  getErrorMessage,
  M2_BASE_URL_API_HIP,
  X_CM_ID,
} from '../../utils/helpers';
import { showToast } from '../../utils/toast';
import { baseApi } from './baseApi';
import { END_POINTS } from './end_points';

// ==================== REQUEST ====================

export interface NotifyLinkPayload {
  notification: {
    patient: {
      id: string;
    };
    careContext: {
      patientReference: string;
      careContextReference: string;
    };
    hiTypes: string[];
    date: string;
    hip: {
      id: string;
    };
  };
}

// ==================== RESPONSE ====================

export interface NotifyLinkResponse {
  response: {
    requestId: string;
  };
}

export const notifyLinkApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    notifyLink: builder.mutation<
      NotifyLinkResponse,
      NotifyLinkPayload
    >({
      async queryFn(body, api, _extraOptions, baseQuery) {
        const state: any = api.getState();
        const selectedXCMID = state?.abha?.selectedXCMID;
        if (!selectedXCMID) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Select the registered HIP service before notifying ABDM.',
            },
          };
        }

        const result: any = await baseQuery({
          url: `${M2_BASE_URL_API_HIP}${END_POINTS.notifyLinkContext}`,
          method: 'POST',
          body,
          headers: {
            'X-HIP-ID': selectedXCMID,
            'X-CM-ID': X_CM_ID,
          },
        });

        if (result.error) {
          return {
            error: result.error as any,
          };
        }

        return {
          data: result.data,
        };
      },
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          showToast(
            'success',
            'Notification Sent',
            'Link notification sent successfully.',
          );
        } catch (error: any) {
          showToast(
            'error',
            'Notification Failed',
            getErrorMessage(error),
          );
        }
      },
    }),
  }),
});

export const {
  useNotifyLinkMutation,
} = notifyLinkApi;

export const getNotifyLinkPayload = (
  abhaAddress: string,
  patientReference: string,
  careContextReference: string,
  hiType: string,
  hipId: string,
): NotifyLinkPayload => ({
  notification: {
    patient: {
      id: abhaAddress,
    },

    careContext: {
      patientReference,
      careContextReference,
    },

    hiTypes: [hiType],

    date: new Date().toISOString(),

    hip: {
      id: hipId,
    },
  },
});