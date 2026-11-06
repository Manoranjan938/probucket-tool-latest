import axios from "shared/services/axios";
import type { CommentRequest } from "features/comments/types";
import type { ApiResponse } from "shared/types";

const useAddComment = () => {
  const addNewComment = async (commentRequest: CommentRequest) => {
    const resp = await axios.post<ApiResponse>("/comment/addComment", commentRequest);

    return resp;
  };

  return [addNewComment] as const;
};

export default useAddComment;
