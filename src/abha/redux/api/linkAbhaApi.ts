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

interface GenerateLinkTokenRequest {
  payload: GenerateLinkTokenPayload;
  bridgeId: string;
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
        const state: any = _api.getState();

        const selectedXCMID = state?.abha?.selectedXCMID;

        const result: any = await baseQuery({
          url: `${M2_BASE_URL_API}${END_POINTS.generateLinkToken}`,
          method: 'POST',
          body,
          headers: {
            'X-HIP-ID': selectedXCMID,
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
            linkToken: "eyJhbGciOiJSUzUxMiJ9.eyJoaXBJZCI6IlNCWF8wMDA3MDQiLCJhYmhhTnVtYmVyIjo5MTQ2NDA2MDUyMjc3NiwidHJhbnNhY3Rpb25JZCI6ImNmMDJiYTAwLTgzZjgtNGU1NC04MmMzLTI1YTg1NWQyYzk5YyIsImFiaGFBZGRyZXNzIjoic2hhbmthcmxhbG1pc3RyaTE4QHNieCIsInN1YiI6InNoYW5rYXJsYWxtaXN0cmkxOEBzYngiLCJpYXQiOjE3ODUzMTUzMDQsImV4cCI6MTgwMTA4MzMwNH0.c8jT_qwcp9Hj9CvhEmrUKVZzeyg6zx5pcmpArjh0KjE0P2tdj7ot9sZNqyw8UCKeoUYg8qmRIZAblsW--5fLjoaKE2nKapwrJkOTM8NHyxpc2nEzlz3pd-q_rDFRzHMVt4-vsLpKepTkw3dFpz5RRob12V2iNBrhB-RT_Ga87VNLwlYNezhjSPuetZnQ2KtyGy0NlcgHJcKznkUucr7STCsI1p7uR3iLqc4vnwcYVfkjbzkLr86eadxF5Z_1_TTu5kh9F3YSIsz6Ft0okHWEIK040IxoN1srLtYEXtWAeZ9y6CkwcE-vEjpFVDTq_BhaHRlNUuItmljf9YJRgchSxQ",
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