import {
    BASE_URL_API,
    getErrorMessage,
    M3_BASE_URL_API_HIP,
} from "../../utils/helpers";

import { showToast } from "../../utils/toast";
import { baseApi } from "./baseApi";
import { API_BOOL, END_POINTS } from "./end_points";

const MOCK_CONSENT_REQUEST = API_BOOL;

export interface ConsentRequestPayload {
    consent: {
        purpose: {
            text: string;
            code: string;
            refUri: string;
        };
        patient: {
            id: string;
        };
        hiu: {
            id: string;
        };
        hip: any;
        careContexts: any;
        requester: {
            name: string;
            identifier: {
                type: string;
                value: string;
                system: string;
            };
        };
        hiTypes: string[];
        permission: {
            accessMode: string;
            dateRange: {
                from: string;
                to: string;
            };
            dataEraseAt: string;
            frequency: {
                unit: string;
                value: number;
                repeats: number;
            };
        };
    };
}

export const consentRequestApi = baseApi.injectEndpoints({

    endpoints: (builder) => ({

        consentRequest:

            builder.mutation<any, ConsentRequestPayload>({

                async queryFn(
                    body,
                    _api,
                    _extraOptions,
                    baseQuery
                ) {

                    console.log(
                        "========== CONSENT REQUEST =========="
                    );

                    console.log(
                        "Request URL =>",
                        END_POINTS.consentRequestInit
                    );

                    console.log(
                        "Request Method => POST"
                    );

                    console.log(
                        "Request Body =>",
                        JSON.stringify(body, null, 2)
                    );

                    // MOCK RESPONSE
                    if (MOCK_CONSENT_REQUEST) {

                        console.log(
                            "========== MOCK CONSENT REQUEST RESPONSE =========="
                        );

                        return {
                            data: {
                                requestId: "CONSENT_REQ_001",
                                consentRequestId: "CR-123456789",
                                status: "REQUESTED",
                                message: "Consent request initiated successfully",
                            },
                        };
                    }

                    // ACTUAL API
                    return await baseQuery({

                        url: `${M3_BASE_URL_API_HIP}${END_POINTS.consentRequestInit}`,

                        method: "POST",

                        body,
                        headers: {
                            "X-CM-ID": "sbx",
                        }

                    });

                },

                async onQueryStarted(
                    arg,
                    {
                        queryFulfilled,
                    }
                ) {

                    console.log(
                        "========== CONSENT REQUEST onQueryStarted =========="
                    );

                    console.log(
                        "Request Argument =>",
                        JSON.stringify(arg, null, 2)
                    );

                    try {

                        const result =
                            await queryFulfilled;

                        console.log(
                            "========== CONSENT REQUEST RESPONSE =========="
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
                            "Consent Request Failed",
                            getErrorMessage(error)
                        );

                        console.log(
                            "========== CONSENT REQUEST ERROR =========="
                        );

                        console.log(error);

                    }

                },

            }),

    }),

});

export const {

    useConsentRequestMutation,

} = consentRequestApi;