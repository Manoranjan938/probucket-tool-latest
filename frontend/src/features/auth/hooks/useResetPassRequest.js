import axios from "Services/axios";

const useResetPassRequest = () => {
  const resetPassword = async (email) => {
    try {
      const resp = await axios.get(`/auth/requestPasswordChange/${email}`);

      return resp;
    } catch (err) {
      throw err;
    }
  };
  return [resetPassword];
};

export default useResetPassRequest;
