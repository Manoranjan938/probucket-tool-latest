import axios from "shared/services/axios";
import type { ProjectTaskRequest } from "features/tasks/types";

const useCreateTask = () => {
  const createProjectTask = async (taskRequest: ProjectTaskRequest) => {
    //const token = localStorage.getItem("jwtToken");
    try {
      const resp = await axios.post<string>("/task/createTask", taskRequest);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [createProjectTask] as const;
};

export default useCreateTask;
