import { api, responseData } from "shared/services/api";
import type { Comment, CommentRequest } from "features/comments/types";
import type { ApiResponse } from "shared/types";

const commentsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getComments: build.query<Comment[], string>({
      query: (taskSequence) => ({ url: `/comment/getComments/${taskSequence}`, emptyListCode: "DATA_NOT_FOUND" }),
      transformResponse: responseData<Comment[]>,
      providesTags: ["Comment"],
    }),
    // Recorded in the task's history
    addComment: build.mutation<ApiResponse, CommentRequest>({
      query: (commentRequest) => ({ url: "/comment/addComment", method: "POST", data: commentRequest }),
      invalidatesTags: ["Comment", "Activity"],
    }),
  }),
});

export const { useGetCommentsQuery, useAddCommentMutation } = commentsApi;
