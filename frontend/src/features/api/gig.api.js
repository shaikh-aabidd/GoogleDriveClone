// src/services/gig.api.js
import { apiSlice } from "./apiSlice";

export const gigApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch paginated list of gigs, with optional filters
    getAllGigs: builder.query({
      query: ({ page = 1, limit = 12, category, tags }) => ({
        url: "/gigs",
        params: { page, limit, category, tags: tags?.join(",") },
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [
              { type: "Gig", id: "LIST" },
              ...result.docs.map(({ _id }) => ({ type: "Gig", id: _id })),
            ]
          : [{ type: "Gig", id: "LIST" }],
    }),

     getMyGigs: builder.query({
      query: () => "/gigs/my-gigs",
      providesTags: ["Gig"],
    }),

    getSuggestions: builder.query({
      query: (q) => `/gigs/suggestions?query=${encodeURIComponent(q)}`,
      transformResponse: (response) => response.data,
    }),

    // Fetch single gig by ID
    getGigById: builder.query({
      query: (id) => `/gigs/${id}`,
      providesTags: (result, error, id) => [{ type: "Gig", id }],
    }),

    // Create a new gig (handles FormData automatically)
    createGig: builder.mutation({
      query: (formData) => ({
        url: "/gigs",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Gig", id: "LIST" }],
    }),

    // Create a custom gig (if you support a /gigs/custom endpoint)
    createCustomGig: builder.mutation({
      query: (customGigData) => ({
        url: "/gigs/custom",
        method: "POST",
        body: customGigData,
      }),
      invalidatesTags: [{ type: "Gig", id: "LIST" }],
    }),

    // Update an existing gig
    updateGig: builder.mutation({
      query: ({ gigId, updatedData }) => ({
        url: `/gigs/${gigId}`,
        method: "PATCH",
        body:
          updatedData instanceof FormData
            ? updatedData
            : (() => {
                const fd = new FormData();
                Object.entries(updatedData).forEach(([key, value]) => {
                  if (key === "images") {
                    value.forEach((file) => fd.append("images", file));
                  } else if (Array.isArray(value)) {
                    fd.append(key, JSON.stringify(value));
                  } else {
                    fd.append(key, value);
                  }
                });
                return fd;
              })(),
      }),
      invalidatesTags: (result, error, { gigId }) => [
        { type: "Gig", id: gigId },
        { type: "Gig", id: "LIST" },
      ],
    }),

    // Delete a gig
    deleteGig: builder.mutation({
      query: (id) => ({
        url: `/gigs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Gig", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllGigsQuery,
  useGetGigByIdQuery,
  useCreateGigMutation,
  useCreateCustomGigMutation,
  useUpdateGigMutation,
  useDeleteGigMutation,
  useGetSuggestionsQuery,
  useGetMyGigsQuery
} = gigApi;
