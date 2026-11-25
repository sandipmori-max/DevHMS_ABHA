import { getErrorMessage } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { RootState } from "../../../store/store";
import { Platform } from "react-native";


const MOCK_GET_PAGE = false;


export interface GetPagePayload {
    token: string;
    page: string;
    id: string;
}


export const getPageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        
        getPage: builder.mutation<any, GetPagePayload>({
            
            async queryFn(
                body,
                api,
                _extraOptions,
                baseQuery
            ) {
                // ================= MOCK =================
                if (MOCK_GET_PAGE) {

                    return {
                        data: {
                            message: "Profile fetched successfully",
                            id: "3",
                            page: "PatientABHAProfile",
                            name: "Rahul Sharma",
                            mobile: "9999999999",
                            abhaNumber: "91-1234-5678-0001"
                        }
                    };
                }


                // ================= ACTUAL API =================

                const state = api.getState() as RootState;
                const baseUrl = state.auth.user?.companyLink;

                let normalizedBase = (baseUrl || "").replace(/\/+$/, ""); 
                    normalizedBase = normalizedBase.replace(
                      /^https:\/\//i,
                      Platform.OS === "ios" ? "https://" : "http://",
                    );
                return await baseQuery({
                    url: `${normalizedBase}/msp_api.aspx/getPage`,
                    method: "POST",
                    body,
                });

            },


            async onQueryStarted(
                _arg,
                {
                    queryFulfilled
                }
            ) {
                try {
                    await queryFulfilled;
                } catch(error:any){
                    showToast(
                        "error",
                        "Get Page Failed",
                        getErrorMessage(error)
                    );
                }

            },


        }),

    }),
});


export const getPagePayload = (
    token:string,
    page:string,
    id:string
):GetPagePayload => ({
    token,
    page,
    id
});


export const {
    useGetPageMutation
} = getPageApi;