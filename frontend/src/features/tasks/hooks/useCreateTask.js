import axios from "Services/axios";

const useCreateTask = () => {
  const createProjectTask = async (taskRequest) => {
    //const token = localStorage.getItem("jwtToken");
    try {
      const resp = await axios.post("/task/createTask", taskRequest);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [createProjectTask];
};

export default useCreateTask;
