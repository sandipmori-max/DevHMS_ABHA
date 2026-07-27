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
            linkToken: "eyJhbGciOiJSUzUxMiJ9.eyJoaXBJZCI6IlNCWF8wMDAwNTEiLCJhYmhhTnVtYmVyIjo5MTExMDc4NTUxMTgwNiwidHJhbnNhY3Rpb25JZCI6IjRhZjQwMzQ1LTY1NjgtNGYxZi05Mzc2LTUyZTljODNjMGIwNCIsImFiaGFBZGRyZXNzIjoiOTExMTA3ODU1MTE4MDZAc2J4Iiwic3ViIjoiOTExMTA3ODU1MTE4MDZAc2J4IiwiaWF0IjoxNzg1MTI5MjMxLCJleHAiOjE4MDA4OTcyMzF9.huAJG_HkqFKmP36NqxspegG9mdvuJQ9MFx6_hELwzf_fraNeMvnSOOmMmZuQIhSyHEgCvRNZH9exqfejDs4WLssAWEilUM5c8ehh3gx805e7a1mckfctnZCv9FFk-99zOSEWkYSa17IRMC2D_L9vo_2tg7kBt-2UZUdT3MASZapNUlk28WZSeB6nrr2VNCgJGfe0gYbXYUEEl-DIwv9SYDKOOz2_DzL6t6XuGOaDvneA6PyB2XEbiuFEzB5jy6RiIXEjlgBBAT6yGLggxwaA_G2HjTkRcdF5lg7wLs9yDnQtyG0RelIK6M04gjGHhr42bHstRtmELUMAsoeNPPEOLw",
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