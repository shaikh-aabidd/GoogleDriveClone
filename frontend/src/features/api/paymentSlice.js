import { apiSlice } from "./apiSlice";
const paymentApi = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: ({ gigId, packageId, selectedExtras,requirements, successUrl, cancelUrl }) => ({
        url: '/checkout',
        method: 'POST',
        body: { gigId, packageId,selectedExtras,requirements, successUrl, cancelUrl },
      }),
    }),
  }),
})

export const {
  useCreateCheckoutSessionMutation,
} = paymentApi;