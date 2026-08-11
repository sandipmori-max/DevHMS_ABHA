import { getErrorMessage, X_CM_ID } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { API_BOOL } from "./end_points";

const MOCK_BRIDGE_SERVICES = API_BOOL;

export const bridgeServicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBridgeServices: builder.query<any, void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        console.log("========== GET BRIDGE SERVICES ==========");

        console.log(
          "Request URL => https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge-services"
        );

        console.log("Request Method => GET");

        // ================= MOCK =================
        if (MOCK_BRIDGE_SERVICES) {
          return {
            data: [
              {
                id: 4623,
                bridgeId: "SBX_000051",
                serviceId: "SBX_000051",
                name: "Demo Facility 2 - HMN",
                isHip: true,
                isHiu: false,
                isPhr: false,
                endpoints: {},
                active: true,
                registerTime: "2021-10-27 11:16:08.168",
                dateCreated: "2021-10-27 11:16:08.168",
                dateModified: "2022-05-13 11:02:27.227",
              },
              {
                id: 19919,
                bridgeId: "SBX_000704",
                serviceId: "IN0910002582",
                name: "NP UT HAPUR hapur",
                isHip: true,
                isHiu: true,
                isPhr: false,
                endpoints: {},
                active: true,
                registerTime: "2023-12-27 10:03:43.343",
                dateCreated: "2023-12-27 10:03:43.343",
                dateModified: "2023-12-27 10:03:43.343",
              },
            ],
          };
        }

        // ================= ACTUAL API =================
        return await baseQuery({
          url: "https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge-services",
          method: "GET",
           headers: {
                                      "X-CM-ID":
                                          X_CM_ID
                                  }
        });
      },

      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;

          console.log(
            "========== BRIDGE SERVICES RESPONSE =========="
          );

          console.log(
            JSON.stringify(result.data, null, 2)
          );
        } catch (error: any) {
          showToast(
            "error",
            "Bridge Services Failed",
            getErrorMessage(error)
          );

          console.log(
            "========== BRIDGE SERVICES ERROR =========="
          );

          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useGetBridgeServicesQuery,
  useLazyGetBridgeServicesQuery,
} = bridgeServicesApi;