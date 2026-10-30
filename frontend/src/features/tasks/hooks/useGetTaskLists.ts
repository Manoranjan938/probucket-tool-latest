import { useState } from "react";
import axios from "shared/services/axios";
import type { TaskListItem } from "features/tasks/types";

const useGetTaskLists = () => {
  const [tasks, setTasks] = useState<TaskListItem[]>();

  const getTaskLists = async (projectIdentifier: string | null) => {
    try {
      const resp = await axios.get<TaskListItem[]>(`/task/getTasks/${projectIdentifier}`);

      setTasks(resp.data);
      return resp;
    } catch (err) {
      //console.log(err);
      throw err;
    }
  };

  return [tasks, getTaskLists] as const;
};

export default useGetTaskLists;
