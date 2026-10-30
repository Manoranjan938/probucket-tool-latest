import axios from "Services/axios";

const useAddComment = () => {
  const addNewComment = async (commentRequest) => {
    try {
      const resp = await axios.post("/comment/addComment", commentRequest);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [addNewComment];
};

export default useAddComment;
