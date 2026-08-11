import { getErrorMessage } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";

export interface EncryptRequest {
  receiverPublicKey: string;
  receiverNonce: string;
  senderPrivateKey: string;
  senderPublicKey: string;
  senderNonce: string;
  plainTextData: string;
}

export const cryptoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    encrypt: builder.mutation<any, EncryptRequest>({
      async queryFn(
        body,
        _api,
        _extraOptions,
        baseQuery
      ) {
        console.log("========== ENCRYPT ==========");
        console.log("Request URL => http://localhost:8090/encrypt");
        console.log("Request Method => POST");
        console.log("Request Body =>", JSON.stringify(body, null, 2));

        return await baseQuery({
          url: "http://192.168.1.41:8090/encrypt",
          method: "POST",
          body,
          headers: {
            "Content-Type": "application/json",
          },
        });
      },

      async onQueryStarted(
        _arg,
        { queryFulfilled }
      ) {
        try {
          const result = await queryFulfilled;

          console.log(
            "========== ENCRYPT RESPONSE =========="
          );
          console.log(
            JSON.stringify(result.data, null, 2)
          );
        } catch (error: any) {
          showToast(
            "error",
            "Encrypt Failed",
            getErrorMessage(error)
          );

          console.log(
            "========== ENCRYPT ERROR =========="
          );
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useEncryptMutation,
} = cryptoApi;