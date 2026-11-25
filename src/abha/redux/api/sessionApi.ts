import { baseApi } from "./baseApi";

import {
    setSession,
} from "../slices/authSlice";
import { certificateApi } from "./certificateApi";
import {
    BASE_URL_PUBLIC_API,
    CLIENT_ID,
    CLIENT_SECRET,
    GRANT_TYPE,
    X_CM_ID,
    getErrorMessage,
} from "../../utils/helpers";
import { END_POINTS } from "./end_points";
import { showToast } from "../../utils/toast";

export const sessionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSession: builder.mutation<any, void>({
            async queryFn(_arg, _api, _extraOptions, baseQuery) {
                if (!CLIENT_ID || !CLIENT_SECRET) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: "Configure ABDM_CLIENT_ID and ABDM_CLIENT_SECRET before requesting an ABDM session.",
                        },
                    };
                }

                return baseQuery({
                    url: `${BASE_URL_PUBLIC_API}${END_POINTS.sessions}`,
                    method: "POST",
                    headers: {
                        "X-CM-ID": X_CM_ID,
                    },
                    body: {
                        clientId: CLIENT_ID,
                        clientSecret: CLIENT_SECRET,
                        grantType: GRANT_TYPE,
                    },
                });
            },

            async onQueryStarted(
                _arg,
                {
                    dispatch,
                    queryFulfilled,
                }
            ) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setSession(data));
                    dispatch(
                        certificateApi.endpoints.getCertificate.initiate(undefined)
                    );
                } catch (error) {
                    showToast(
                        "error",
                        "ABDM session failed",
                        getErrorMessage(error)
                    );
                }
            },
        }),
    }),
});

export const {
    useCreateSessionMutation,
} = sessionApi;