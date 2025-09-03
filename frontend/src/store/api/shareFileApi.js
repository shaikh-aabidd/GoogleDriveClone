import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const fileShareApi = createApi({
  reducerPath: "fileShareApi",
  baseQuery,
  tagTypes: ["Share"],
  endpoints: (builder) => ({
    // existing endpoints...

    getSharedFile: builder.query({
      query: (shareId) => ({
        url: `/share/${shareId}`,
        method: "GET",
      }),
      providesTags: ["Share"],
    }),

     getSharedFiles: builder.query({
      query: () => ({
        url: "/share/files",
        method: "GET",
        credentials: "include", // if using cookies
      }),
      providesTags: ["Share"],
    }),

    shareFileWithEmail: builder.mutation({
      query: ({ fileId, email, permission }) => ({
        url: "/share/email",
        method: "POST",
        body: { fileId, email, permission },
      }),
      invalidatesTags: ["Share"],
    }),

    generateSharableLink: builder.mutation({
      query: ({ fileId, permission }) => ({
        url: "/share/link",
        method: "POST",
        body: { fileId, permission },
      }),
      invalidatesTags: ["Share"],
    }),
  }),
});

export const {
  useGetSharedFileQuery,
  useGetSharedFilesQuery,
  useShareFileWithEmailMutation,
  useGenerateSharableLinkMutation,
} = fileShareApi;
