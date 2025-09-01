// src/features/api/message.api.js
import { apiSlice } from "./apiSlice";

export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch the conversation between the current user and another user
    getConversation: builder.query({
      /**
       * @param {string} userId - the other participant's user ID
       * @returns {string} the URL for the GET request
       */
      query: (userId) => `/message/${userId}`,
      /**
       * We tag the result by the other user's ID so we can later invalidate
       * and refetch only this conversation when a new message is sent.
       */
      providesTags: (_result, _error, userId) => [
        { type: "Message", id: `CONVERSATION-${userId}` },
      ],
    }),

    // Send a new message in the current conversation
    sendMessage: builder.mutation({
      /**
       * @param {{ receiverId: string; orderId?: string; content: string }} messageData
       * @returns {{ url: string; method: string; body: object }}
       */
      query: (messageData) => ({
        url: `/message`,
        method: "POST",
        body: messageData,
      }),
      /**
       * After sending, invalidate the conversation tag for that receiver
       * so getConversation will refetch the updated message list.
       */
      invalidatesTags: (_result, _error, { receiverId }) => [
        { type: "Message", id: `CONVERSATION-${receiverId}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetConversationQuery,
  useSendMessageMutation,
} = messageApi;
