import { getErrorMessage, M2_BASE_URL_API } from '../../utils/helpers';
import { showToast } from '../../utils/toast';
import { baseApi } from './baseApi';
import { END_POINTS } from './end_points';

// ===== Request Payload =====
export interface GenerateLinkTokenPayload {
  abhaNumber: number;
  abhaAddress: string;
  name: string;
  gender: 'M' | 'F' | 'O';
  yearOfBirth: number;
}

// ===== Response =====
export interface GenerateLinkTokenResponse {
  token: string; // X-LINK-TOKEN
  transactionId: string;
}

export const linkAbhaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateLinkToken: builder.mutation<
      GenerateLinkTokenResponse,
      GenerateLinkTokenPayload
    >({
      async queryFn(body, _api, _extraOptions, baseQuery) {
        console.log('========== GENERATE LINK TOKEN ==========');
        console.log('Request URL =>', END_POINTS.generateLinkToken);
        console.log('Request Body =>', JSON.stringify(body, null, 2));

        const result: any = await baseQuery({
          url: `${M2_BASE_URL_API}${END_POINTS.generateLinkToken}`,
          method: 'POST',
          body,
          headers: {
            'X-HIP-ID': 'SBX_000051',
            'X-CM-ID': 'sbx',
          },
        });

        console.log(
          'Generate Link Token Result =>',
          JSON.stringify(result, null, 2),
        );

        if (result.error) {
          return { error: result.error as any };
        }

        // ABDM response mapping
        return {
          data: {
            token: result.data?.token,
            transactionId: result.data?.transactionId,
          },
        };
      },

      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('========== GENERATE LINK TOKEN STARTED ==========');
        console.log('Payload =>', JSON.stringify(arg, null, 2));

        try {
          const { data } = await queryFulfilled;

          console.log('Generate Link Token Success =>', data);

          showToast(
            'success',
            'Link Request Initiated',
            'Patient approval request has been sent to ABHA app',
          );
        } catch (error: any) {
          console.log('========== GENERATE LINK TOKEN ERROR ==========');
          console.log(error);

          showToast(
            'error',
            'Link Request Failed',
            getErrorMessage(error),
          );
        }
      },
    }),
  }),
});

export const { useGenerateLinkTokenMutation } = linkAbhaApi;