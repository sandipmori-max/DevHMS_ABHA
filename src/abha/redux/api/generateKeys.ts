import { getErrorMessage } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";

export const keyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateKeys: builder.query<any, void>({
      async queryFn(
        _arg,
        _api,
        _extraOptions,
        baseQuery
      ) {
        console.log(
          "========== GENERATE KEYS =========="
        );

        console.log(
          "Request URL => http://localhost:8090/keys/generate"
        );

        console.log(
          "Request Method => GET"
        );

        return await baseQuery({
          url: "http://192.168.1.41:8090/keys/generate",
          method: "GET",
        });
      },

      async onQueryStarted(
        _arg,
        { queryFulfilled }
      ) {
        try {
          const result = await queryFulfilled;

          console.log(
            "========== GENERATE KEYS RESPONSE =========="
          );

          console.log(
            JSON.stringify(
              result.data,
              null,
              2
            )
          );
        } catch (error: any) {
          showToast(
            "error",
            "Generate Keys Failed",
             error
          );

          console.log(
            "========== GENERATE KEYS ERROR =========="
          );

          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useGenerateKeysQuery,
  useLazyGenerateKeysQuery,
} = keyApi;