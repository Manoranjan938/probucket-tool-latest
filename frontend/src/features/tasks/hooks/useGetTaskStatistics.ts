import { useState } from "react";
import axios from "shared/services/axios";
import type { TaskStatistics } from "features/tasks/types";
import type { ApiResponse } from "shared/types";

const useGetTaskStatistics = () => {
  const [stats, setStats] = useState<Partial<TaskStatistics>>({});

  const getTaskStats = async (taskId: string | undefined) => {
    const resp = await axios.get<ApiResponse<TaskStatistics>>(`/task/getStatistics/${taskId}`);

    setStats(resp.data.data);
  };

  return [stats, getTaskStats] as const;
};

export default useGetTaskStatistics;
