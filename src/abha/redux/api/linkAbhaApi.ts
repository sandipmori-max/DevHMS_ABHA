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
            linkToken: "eyJhbGciOiJSUzUxMiJ9.eyJoaXBJZCI6Ik1TVEFSLTAwMDAxIiwiYWJoYU51bWJlciI6OTE0NjQwNjA1MjI3NzYsInRyYW5zYWN0aW9uSWQiOiJjZjAyYmEwMC04M2Y4LTRlNTQtODJjMy0yNWE4NTVkMmM5OWMiLCJhYmhhQWRkcmVzcyI6InNoYW5rYXJsYWxtaXN0cmkxOEBzYngiLCJzdWIiOiJzaGFua2FybGFsbWlzdHJpMThAc2J4IiwiaWF0IjoxNzg1NTY4NDE0LCJleHAiOjE4MDEzMzY0MTR9.O07SAE7mClE1-f0H0j6GqxW5AdeWRArRJEkzmBiyfVr87ySzgB6IJ739P9cM1F3ssI883ZrzK6JsbD6304iqaVHG6YAz8ldP3VYCX7RMISO-fv83_gAbvRj5xT4174fg3cWzfMFX4RVJE9vzDUA_luI2xLQqHp8-fCTvbzyJ9_qGDuMSHmvj91rE2uTwr8IwjXNtQkpNesbbCoJPS1j73yjWb0L2EH4qIqhEp5_FrW2D8IvZdSsP4FQgIJ9GxD8wEis_ZHabRazyk2lAZS3ibg9JPDFXHD5aq7qJbGo4YRTedEiBv8NuEv5NDjtLwrM8S1pmRh9BaA9tHNjqrswECA",
            response: {
              requestId: "e8277dc0-5f42-4579-b9a3-ac1b6352ca8c"
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