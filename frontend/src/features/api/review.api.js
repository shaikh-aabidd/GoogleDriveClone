// src/features/api/review.api.js
import { apiSlice } from "./apiSlice";

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all reviews the current user has written
    getMyReviews: builder.query({
      query: () => `/reviews/me`,
      transformResponse: (response) => response.data,
      providesTags: (result = [], _error, _arg) => [
        // tag each review individually
        ...result.map(({ _id }) => ({ type: "Review", id: _id })),
        // and a LIST tag so we can refetch the whole list
        { type: "Review", id: "MY_REVIEWS" },
      ],
    }),

    // Fetch all reviews for a specific gig
    getReviewsByGig: builder.query({
      query: (gigId) => `/reviews/gig/${gigId}`,
      transformResponse: (response) => response.data,
      providesTags: (result = [], _error, gigId) => [
        ...result.map(({ _id }) => ({ type: "Review", id: _id })),
        { type: "Review", id: `GIG_${gigId}` },
      ],
    }),

    // Post a new review for a gig
    createReview: builder.mutation({
      query: ({ gigId, rating, comment }) => ({
        url: `/reviews/gig/${gigId}`,
        method: "POST",
        body: { rating, comment },
      }),
      invalidatesTags: (_result, _error, { gigId }) => [
        { type: "Review", id: `GIG_${gigId}` },
        { type: "Review", id: "MY_REVIEWS" },
      ],
    }),

    // Update an existing review
    updateReview: builder.mutation({
      query: ({ reviewId, rating, comment }) => ({
        url: `/reviews/${reviewId}`,
        method: "PUT",
        body: { rating, comment },
      }),
      invalidatesTags: (result, _error, { reviewId, gigId }) => [
        // if the controller returns the updated review, result._id === reviewId
        { type: "Review", id: reviewId },
        // also refresh the gig-level list:
        { type: "Review", id: `GIG_${result.gig}` },
        // and the user's own reviews
        { type: "Review", id: "MY_REVIEWS" },
      ],
    }),

    // Delete a review
    deleteReview: builder.mutation({
      query: ({ reviewId }) => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, _error, { reviewId }) => [
        { type: "Review", id: reviewId },
        { type: "Review", id: "MY_REVIEWS" },
        // you could also invalidate the gig-level tag if you know the gigId here
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyReviewsQuery,
  useGetReviewsByGigQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
