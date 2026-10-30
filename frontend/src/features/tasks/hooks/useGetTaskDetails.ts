import axios from "shared/services/axios";
import { useState } from "react";
import type { TaskDetails } from "features/tasks/types";

const useGetTaskDetails = () => {
  const [task, setTask] = useState<Partial<TaskDetails>>({});

  const getTaskDetails = async (sequence: string) => {
    try {
      const resp = await axios.get<TaskDetails>(`/task/getTaskDetails/${sequence}`);

      setTask(resp.data);
      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [task, getTaskDetails] as const;
};

export default useGetTaskDetails;
