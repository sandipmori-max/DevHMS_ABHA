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
        console.log(
          '========== LINK CONTEXT NOTIFY =========='
        );

        console.log(
          'Request URL =>',
          END_POINTS.notifyLinkContext,
        );

        console.log(
          'Request Body =>',
          JSON.stringify(body, null, 2),
        );

        const state: any = api.getState();

        const linkToken =
          state.abha.linkToken;

        const result: any = await baseQuery({
          url: `${M2_BASE_URL_API}${END_POINTS.notifyLinkContext}`,
          method: 'POST',
          body,
          headers: {
            'X-HIP-ID': CLIENT_ID,
            'X-CM-ID': 'sbx',
            'X-LINK-TOKEN': linkToken,
          },
        });

        console.log(
          'Notify Result =>',
          JSON.stringify(result, null, 2),
        );

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
        arg,
        { queryFulfilled },
      ) {
        console.log(
          '========== LINK CONTEXT NOTIFY STARTED =========='
        );

        console.log(
          JSON.stringify(arg, null, 2),
        );

        try {
          const { data } =
            await queryFulfilled;

          console.log(
            'Notify Success =>',
            data,
          );

          showToast(
            'success',
            'Notification Sent',
            'Link notification sent successfully.',
          );
        } catch (error: any) {
          console.log(
            '========== NOTIFY ERROR =========='
          );

          console.log(error);

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