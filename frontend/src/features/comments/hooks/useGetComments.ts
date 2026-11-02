import axios from "shared/services/axios";
import { useState } from "react";
import type { Comment } from "features/comments/types";
import type { ApiResponse } from "shared/types";

const useGetComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const getComments = async (taskId: string | undefined) => {
    const resp = await axios.get<ApiResponse<Comment[]>>(`/comment/getComments/${taskId}`);

    setComments(resp.data.data);
  };

  return [comments, getComments] as const;
};

export default useGetComments;
