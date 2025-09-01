import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/api/v1',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const fileApi = createApi({
  reducerPath: 'fileApi',
  baseQuery,
  tagTypes: ['File', 'Storage'],
  endpoints: (builder) => ({
    getFiles: builder.query({
      query: (parentFolderId) => ({
        url: '/files',
        params: { parentFolderId },
      }),
      providesTags: ['File'],
    }),
    uploadFile: builder.mutation({
      query: (formData) => ({
        url: '/files/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['File', 'Storage'],
    }),
    createFolder: builder.mutation({
      query: (data) => ({
        url: '/files/folder',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['File'],
    }),
    downloadFile: builder.mutation({
      query: (fileId) => ({
        url: `/files/download/${fileId}`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    deleteFile: builder.mutation({
      query: (fileId) => ({
        url: `/files/${fileId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['File', 'Storage'],
    }),
    renameFile: builder.mutation({
      query: ({ fileId, newName }) => ({
        url: `/files/${fileId}/rename`,
        method: 'PATCH',
        body: { newName },
      }),
      invalidatesTags: ['File'],
    }),
    searchFiles: builder.query({
      query: (query) => ({
        url: '/files/search',
        params: { query },
      }),
      providesTags: ['File'],
    }),
    getStorageInfo: builder.query({
      query: () => '/files/storage-info',
      providesTags: ['Storage'],
    }),
  }),
});

export const {
  useGetFilesQuery,
  useUploadFileMutation,
  useCreateFolderMutation,
  useDownloadFileMutation,
  useDeleteFileMutation,
  useRenameFileMutation,
  useSearchFilesQuery,
  useGetStorageInfoQuery,
} = fileApi;
