import axios from "Services/axios";
import { useState } from "react";

const useGetComments = () => {
  const [comments, setComments] = useState([]);
  const getComments = async (taskId) => {
    const resp = await axios.get(`/comment/getComments/${taskId}`);

    setComments(resp.data);
  };

  return [comments, getComments];
};

export default useGetComments;
