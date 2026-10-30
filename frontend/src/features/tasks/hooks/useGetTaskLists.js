import { useState } from "react";
import axios from "Services/axios";

const useGetTaskLists = () => {
  const [tasks, setTasks] = useState();

  const getTaskLists = async (projectIdentifier) => {
    try {
      const resp = await axios.get(`/task/getTasks/${projectIdentifier}`);

      setTasks(resp.data);
      return resp;
    } catch (err) {
      //console.log(err);
      throw err;
    }
  };

  return [tasks, getTaskLists];
};

export default useGetTaskLists;
