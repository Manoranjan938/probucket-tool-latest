import { useState } from "react";
import axios from "shared/services/axios";
import type { Subtask } from "features/tasks/types";
import type { ApiResponse } from "shared/types";

const useGetSubTasks = () => {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  const getSubtaskList = async (taskId: string | undefined) => {
    const resp = await axios.get<ApiResponse<Subtask[]>>(`/task/getSubtaskList/${taskId}`);

    setSubtasks(resp.data.data);
    return resp;
  };

  return [subtasks, getSubtaskList] as const;
};

export default useGetSubTasks;
