import { useState } from "react";
import axios from "Services/axios";

const useGetTaskStatistics = () => {
  const [stats, setStats] = useState({});

  const getTaskStats = async (taskId) => {
    const resp = await axios.get(`/task/getStatistics/${taskId}`);

    setStats(resp.data);
  };

  return [stats, getTaskStats];
};

export default useGetTaskStatistics;
