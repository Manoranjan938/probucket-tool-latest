import { useState } from "react";
import axios from "Services/axios";

const useGetSubTasks = () => {
  const [subtasks, setSubtasks] = useState([]);

  const getSubtaskList = async (taskId) => {
    try {
      const resp = await axios.get(`/task/getSubtaskList/${taskId}`);

      setSubtasks(resp.data);
      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [subtasks, getSubtaskList];
};

export default useGetSubTasks;
