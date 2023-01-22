import axios from "Services/axios";

const useUpdatePassword = () => {
  const updatePassword = async (update) => {
    try {
      const resp = axios.post("/user/updatePassword", update);
      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [updatePassword];
};

export default useUpdatePassword;
