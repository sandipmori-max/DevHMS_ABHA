import { RootState } from "../../../store/store";
import { baseApi } from "./baseApi";
import { showToast } from "../../utils/toast";
import { Platform } from "react-native";
import {
  logAbhaApiRequest,
  logAbhaApiResponse,
} from "../../utils/apiLogging";

const MOCK_SAVE_PAGE = false;

export interface SavePagePayload {
  token: string;
  page: string;
  data: string; // JSON string
}

export interface SavePageResponse {
  success: number;
  message?: string;
  [key: string]: any;
}

export const savePageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    savePage: builder.mutation<SavePageResponse, SavePagePayload>({
      async queryFn(body, api, _extraOptions, baseQuery) {
        const state = api.getState() as RootState & {
          auth: RootState["auth"] & {
            user: (RootState["auth"]["user"] & { companyLink?: string }) | null;
          };
        };
        const baseUrl = state.auth.user?.companyLink;
        let normalizedBase = (baseUrl || "").replace(/\/+$/, "");
        normalizedBase = normalizedBase.replace(
          /^https:\/\//i,
          Platform.OS === "ios" ? "https://" : "http://",
        );
        const requestUrl = `${normalizedBase}/msp_api.aspx/pageSave`;
        logAbhaApiRequest("POST", requestUrl, JSON.stringify(body));

        // MOCK RESPONSE
        if (MOCK_SAVE_PAGE) {
          return {
            data: {
              success: 1,
              message: "Page saved successfully",
            },
          };
        }

        // ACTUAL API
        const response: any = await baseQuery({
          url: requestUrl,
          method: "POST",
          body,
        });
        logAbhaApiResponse(
          "POST",
          requestUrl,
          response.meta?.response?.status ?? (response.error ? 500 : 200),
          !response.error,
        );
        if (response.error) {
          return { error: response.error };
        }

        if (response.data?.d) {
          const raw = response.data.d;

          try {
            response.data = JSON.parse(raw);
          } catch {
            response.data = {
              success: Number(raw?.split(",")[0]) || 0,
              message: raw?.split(",").slice(1).join(",") || raw,
            };
          }
        }

        if (response.data === undefined || response.data === null) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "The save-page server returned an empty response.",
            },
          };
        }

        return {
          data: response.data,
        };
      },

      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          showToast(
            "error",
            "Something went wrong. Please try again later."
          );
        }
      },
    }),
  }),
});

export const getSavePagePayload = (
  token: string,
  page: string,
  data: string
): SavePagePayload => ({
  token,
  page,
  data,
});

export const { useSavePageMutation } = savePageApi;