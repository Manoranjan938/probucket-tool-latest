import axios from "shared/services/axios";
import type { UpdateTaskRequest } from "features/tasks/types";
import type { ApiResponse } from "shared/types";

const useUpdateTask = () => {
  const updateTask = async (updateRequest: UpdateTaskRequest) => {
    try {
      const resp = await axios.post<ApiResponse>("/task/updateTask", updateRequest);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [updateTask] as const;
};

export default useUpdateTask;
