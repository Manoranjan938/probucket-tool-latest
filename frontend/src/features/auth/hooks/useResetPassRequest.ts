import axios from "shared/services/axios";

const useResetPassRequest = () => {
  const resetPassword = async (email: string) => {
    try {
      const resp = await axios.get<string>(`/auth/requestPasswordChange/${email}`);

      return resp;
    } catch (err) {
      throw err;
    }
  };
  return [resetPassword] as const;
};

export default useResetPassRequest;
