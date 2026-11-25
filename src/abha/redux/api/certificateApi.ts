import { baseApi } from "./baseApi";

import {
    setCertificate
} from "../slices/authSlice";
import { BASE_URL_API, getErrorMessage, X_CM_ID } from "../../utils/helpers";
import { END_POINTS } from "./end_points";
import { showToast } from "../../utils/toast";


export const certificateApi =

    baseApi.injectEndpoints({

        endpoints: (builder) => ({
            getCertificate:
                builder.query({
                    query: () => ({
                        url:
                            `${BASE_URL_API}${END_POINTS.certificate}`,
                        method: "GET",
                        headers: {
                            "X-CM-ID":
                                X_CM_ID
                        }
                    }),
                    async onQueryStarted(
                        arg,
                        {
                            dispatch,
                            queryFulfilled
                        }

                    ) {


                        try {


                            const {
                                data
                            } =
                                await queryFulfilled;
                            dispatch(
                                setCertificate(data)

                            );

                        }
                        catch (error) {
                            showToast(
                                "error",
                                "ABDM certificate failed",
                                getErrorMessage(error)
                            );
                        }


                    }


                })


        })

    });



export const {

    useGetCertificateQuery

} = certificateApi;