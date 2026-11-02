import axios from "shared/services/axios";
import type { ProjectTaskRequest } from "features/tasks/types";
import type { ApiResponse } from "shared/types";

const useCreateTask = () => {
  const createProjectTask = async (taskRequest: ProjectTaskRequest) => {
    //const token = localStorage.getItem("jwtToken");
    try {
      const resp = await axios.post<ApiResponse>("/task/createTask", taskRequest);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [createProjectTask] as const;
};

export default useCreateTask;
