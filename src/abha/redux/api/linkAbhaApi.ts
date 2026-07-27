import { CLIENT_ID, getErrorMessage, M2_BASE_URL_API } from '../../utils/helpers';
import { showToast } from '../../utils/toast';
import { setLinkToken } from '../slices/abhaSlice';
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
      any,
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
            'X-HIP-ID': CLIENT_ID,
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
            abhaAddress: "91110785511806@sbx",
            linkToken: "eyJhbGciOiJSUzUxMiJ9.eyJoaXBJZCI6IlNCWF8wMDAwNTEiLCJhYmhhTnVtYmVyIjo5MTc3MzI1NzI0NjUyMiwidHJhbnNhY3Rpb25JZCI6ImNmYjIzNTI3LTBmMDQtNDM4ZS04NjdkLTkwZDQ0NDI4NThjYSIsImFiaGFBZGRyZXNzIjoidmFydW4yMDAxQHNieCIsInN1YiI6InZhcnVuMjAwMUBzYngiLCJpYXQiOjE3ODUxNDM2MjEsImV4cCI6MTgwMDkxMTYyMX0.XIXH_GpDMGxOU4_T9sUzpa3ukdzUUPPzPV521444gSvtE9EHwmKw7VLBzxAIXVLPrRurIaSC2V1kxYSAQovemSHqD2in3nTWI_hnYSTRDd-0zUVCNA4MUtySvIsSHq1fAE-mO2jHr7RyQuwGJDCnA_zUWNeYHhH96EpYHnlV3Jtjpbd7-z-30plJDvk0PcxtXqMpQtTxo0s3pbcqA74KIAFJ5FfkdcJBlgmWfJ3aBYc0RJMn2hml-oWu0yR94p2TCdnkCH_I11MqaZC4PqFBcO03BcyhGpHnaOhPLYePhVkvI_zp0885Jwmpd_WpoWW56ZZY1oNQG-zZORkE37Ik-A",
            response: {
              requestId: "8fc9321d-ad37-44ab-a9d2-4b00131a415b"
            }
          },
        };
      },

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        console.log('========== GENERATE LINK TOKEN STARTED ==========');
        console.log('Payload =>', JSON.stringify(arg, null, 2));

        try {
          const { data } = await queryFulfilled;

          console.log('Generate Link Token Success =>', data);
          
          dispatch(setLinkToken(data?.linkToken))
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