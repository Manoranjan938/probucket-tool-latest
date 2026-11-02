import axios from "shared/services/axios";
import { useState } from "react";
import type { TaskDetails } from "features/tasks/types";
import type { ApiResponse } from "shared/types";

const useGetTaskDetails = () => {
  const [task, setTask] = useState<Partial<TaskDetails>>({});

  const getTaskDetails = async (sequence: string) => {
    try {
      const resp = await axios.get<ApiResponse<TaskDetails>>(`/task/getTaskDetails/${sequence}`);

      setTask(resp.data.data);
      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [task, getTaskDetails] as const;
};

export default useGetTaskDetails;
