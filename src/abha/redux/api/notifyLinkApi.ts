import {
  CLIENT_ID,
  getErrorMessage,
  M2_BASE_URL_API,
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

        const linkToken =
          state.abha.linkToken;
        const selectedXCMID = state?.abha?.selectedXCMID;
        const result: any = await baseQuery({
          url: `${M2_BASE_URL_API}${END_POINTS.notifyLinkContext}`,
          method: 'POST',
          body,
          headers: {
            'X-HIP-ID': selectedXCMID,
            'X-CM-ID': 'sbx',
            'X-LINK-TOKEN': linkToken,
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

      async onQueryStarted(
        _arg,
        { queryFulfilled },
      ) {
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
  careContextReference: string,
  hiType: string,
): NotifyLinkPayload => ({
  notification: {
    patient: {
      id: abhaAddress,
    },

    careContext: {
      patientReference: abhaAddress,
      careContextReference,
    },

    hiTypes: [hiType],

    date: new Date().toISOString(),

    hip: {
      id: 'SBX_000051',
    },
  },
});