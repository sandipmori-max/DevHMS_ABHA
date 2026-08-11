import { CLIENT_ID, getErrorMessage, M2_BASE_URL_API, M2_BASE_URL_API_HIP } from '../../utils/helpers';
import { showToast } from '../../utils/toast';
import { baseApi } from './baseApi';
import { END_POINTS } from './end_points';

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

export const careContextLinkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    linkCareContext: builder.mutation<
      LinkCareContextResponse,
      LinkCareContextPayload
    >({
      async queryFn(body, api, _extraOptions, baseQuery) {
        console.log('========== LINK CARE CONTEXT ==========');
        console.log(
          'Request URL =>',
          END_POINTS.linkCareContext,
        );
        console.log(
          'Request Body =>',
          JSON.stringify(body, null, 2),
        );

        const state: any = api.getState();

        const linkToken = state?.abha?.linkToken;

 
        const selectedXCMID = state?.abha?.selectedXCMID;
        const result: any = await baseQuery({
          url: `${M2_BASE_URL_API_HIP}${END_POINTS.linkCareContext}`,
          method: 'POST',
          body,
          headers: {
            'X-HIP-ID': selectedXCMID,
            'X-CM-ID': 'sbx',
            'X-LINK-TOKEN': linkToken,
          },
        });

        console.log(
          'Link CareContext Result =>',
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

      async onQueryStarted(arg, { queryFulfilled }) {
        console.log(
          '========== LINK CARE CONTEXT STARTED =========='
        );

        console.log(
          'Payload =>',
          JSON.stringify(arg, null, 2),
        );

        try {
          const { data } = await queryFulfilled;

          console.log(
            'Link CareContext Success =>',
            JSON.stringify(data, null, 2),
          );

          showToast(
            'success',
            'Success',
            'Care Context linked successfully.',
          );
        } catch (error: any) {
          console.log(
            '========== LINK CARE CONTEXT ERROR =========='
          );
          console.log(error);

          showToast(
            'error',
            'Link Failed',
            getErrorMessage(error),
          );
        }
      },
    }),
  }),
});

export const {
  useLinkCareContextMutation,
} = careContextLinkApi;