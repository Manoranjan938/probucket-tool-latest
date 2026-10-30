import axios from "shared/services/axios";
import { useState } from "react";
import type { Comment } from "features/comments/types";

const useGetComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const getComments = async (taskId: string | undefined) => {
    const resp = await axios.get<Comment[]>(`/comment/getComments/${taskId}`);

    setComments(resp.data);
  };

  return [comments, getComments] as const;
};

export default useGetComments;
