import { useState } from "react";
import axios from "shared/services/axios";
import type { TaskListItem } from "features/tasks/types";
import type { ApiResponse } from "shared/types";

const useGetTaskLists = () => {
  const [tasks, setTasks] = useState<TaskListItem[]>();

  const getTaskLists = async (projectIdentifier: string | null) => {
    const resp = await axios.get<ApiResponse<TaskListItem[]>>(`/task/getTasks/${projectIdentifier}`);

    setTasks(resp.data.data);
    return resp;
  };

  return [tasks, getTaskLists] as const;
};

export default useGetTaskLists;
