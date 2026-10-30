import axios from "Services/axios";

const useUpdateTask = () => {
  const updateTask = async (updateRequest) => {
    try {
      const resp = await axios.post("/task/updateTask", updateRequest);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [updateTask];
};

export default useUpdateTask;
