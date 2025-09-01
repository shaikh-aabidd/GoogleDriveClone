// services/earningApi.js
import { apiSlice } from "./apiSlice";

export const earningApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEarnings: builder.query({
      query: () => "/earning/my-earnings",
      providesTags: ["Earning"],
    }),
  }),
});

export const { useGetEarningsQuery } = earningApi;
