import axios from "shared/services/axios";
import type { UpdateDueDateRequest } from "features/tasks/types";
import type { ApiResponse } from "shared/types";

const useUpdateDueDate = () => {
  const updateDueDate = async (request: UpdateDueDateRequest) => {
    const resp = await axios.post<ApiResponse>("/task/updateDueDate", request);

    return resp;
  };

  return [updateDueDate] as const;
};

export default useUpdateDueDate;
