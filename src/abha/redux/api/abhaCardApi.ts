import { RootState } from "../../../store/store";
import {
  BASE_URL_API,
  getErrorMessage,
} from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { API_BOOL, END_POINTS } from "./end_points";

const MOCK_ABHA_CARD = API_BOOL;

export const abhaCardApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      profileAbhaCard: builder.query<any, void>({
        async queryFn(
          _arg,
          _api,
          _extraOptions,
          baseQuery
        ) {
          console.log(
            "========== PROFILE ABHA CARD =========="
          );
          const state = _api.getState() as RootState;
          const xtoken = state.abha?.tToken;

          console.log(
            "Request URL =>",
            END_POINTS.profileAbhaCard
          );

          console.log(
            "Request Method => GET"
          );

          // MOCK RESPONSE
          if (MOCK_ABHA_CARD) {
            return {
              data: {
                card: "969696969696",
              },
            };
          }

          return await baseQuery({
            url: `${BASE_URL_API}${END_POINTS.profileAbhaCard}`,
            method: "GET",
            headers: {
              "X-token":
                `Bearer ${xtoken}`
            }
          });
        },

        async onQueryStarted(
          _arg,
          { queryFulfilled }
        ) {
          try {
            const result =
              await queryFulfilled;

            console.log(
              "========== PROFILE ABHA CARD RESPONSE =========="
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
              "ABHA Card Failed",
              getErrorMessage(error)
            );

            console.log(
              "========== PROFILE ABHA CARD ERROR =========="
            );

            console.log(error);
          }
        },
      }),
    }),
  });

export const {
  useProfileAbhaCardQuery,
  useLazyProfileAbhaCardQuery,
} = abhaCardApi;