import axios from "Services/axios";

const useCreateNewSubtask = () => {
  const createNewSubtask = async (subtask) => {
    try {
      const resp = await axios.post("/task/createSubTask", subtask);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [createNewSubtask];
};

export default useCreateNewSubtask;
