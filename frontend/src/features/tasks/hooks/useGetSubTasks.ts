import { useState } from "react";
import axios from "shared/services/axios";
import type { Subtask } from "features/tasks/types";

const useGetSubTasks = () => {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  const getSubtaskList = async (taskId: string | undefined) => {
    try {
      const resp = await axios.get<Subtask[]>(`/task/getSubtaskList/${taskId}`);

      setSubtasks(resp.data);
      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [subtasks, getSubtaskList] as const;
};

export default useGetSubTasks;
