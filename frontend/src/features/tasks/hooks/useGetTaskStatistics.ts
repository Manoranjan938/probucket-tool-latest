import { useState } from "react";
import axios from "shared/services/axios";
import type { TaskStatistics } from "features/tasks/types";

const useGetTaskStatistics = () => {
  const [stats, setStats] = useState<Partial<TaskStatistics>>({});

  const getTaskStats = async (taskId: string | undefined) => {
    const resp = await axios.get<TaskStatistics>(`/task/getStatistics/${taskId}`);

    setStats(resp.data);
  };

  return [stats, getTaskStats] as const;
};

export default useGetTaskStatistics;
