import axios from "Services/axios";
import { useState } from "react";

const useGetTaskDetails = () => {
  const [task, setTask] = useState({});

  const getTaskDetails = async (sequence) => {
    try {
      const resp = await axios.get(`/task/getTaskDetails/${sequence}`);

      setTask(resp.data);
      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [task, getTaskDetails];
};

export default useGetTaskDetails;
