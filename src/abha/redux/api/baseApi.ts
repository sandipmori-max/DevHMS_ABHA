import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { generateGUID } from "../../utils/helpers";

const fetchWithAbhaLogging: typeof fetch = async (input, init) => {
  const rawUrl =
    typeof input === "string"
      ? input
      : "url" in input
        ? input.url
        : input.toString();
  const endpoint = rawUrl.split("?")[0];
  const method =
    init?.method ??
    (typeof input !== "string" && "method" in input ? input.method : "GET");

  console.log("[ABHA API] Request", method, endpoint);

  try {
    const response = await fetch(input, init);
    console.log("[ABHA API] Response", method, endpoint, {
      status: response.status,
      ok: response.ok,
    });
    return response;
  } catch (error) {
    console.error("[ABHA API] Network failure", method, endpoint, {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    throw error;
  }
};

export const baseApi =
  createApi({
    reducerPath: "baseApi",

    baseQuery: fetchBaseQuery({
      fetchFn: fetchWithAbhaLogging,
      // baseUrl: BASE_URL_PUBLIC_API,

      prepareHeaders: (headers, { getState, endpoint }) => {
        const state = getState() as any;
        const token = state?.abhaauth?.accessToken;

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }

        const requestId = headers.get("REQUEST-ID") || generateGUID();
        headers.set("REQUEST-ID", requestId);
        headers.set("TIMESTAMP", new Date().toISOString());

        const skipEndpoints = [
          "profileQrCode",
          "profileAbhaCard",
          "getBridgeServices"
        ];

        if (skipEndpoints.includes(endpoint)) {
          headers.delete("Content-Type");
          headers.delete("content-type");
          headers.delete("Accept");
          headers.delete("accept");
        } else {
          headers.set("Content-Type", "application/json");
        }


        return headers;
      },
    }),

    endpoints: () => ({}),
  });