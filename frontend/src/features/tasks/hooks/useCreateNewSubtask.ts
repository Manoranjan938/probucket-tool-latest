import axios from "shared/services/axios";
import type { CreateSubtaskRequest } from "features/tasks/types";

const useCreateNewSubtask = () => {
  const createNewSubtask = async (subtask: CreateSubtaskRequest) => {
    try {
      const resp = await axios.post<string>("/task/createSubTask", subtask);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [createNewSubtask] as const;
};

export default useCreateNewSubtask;
