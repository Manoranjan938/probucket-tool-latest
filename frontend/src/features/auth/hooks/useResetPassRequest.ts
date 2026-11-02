import axios from "shared/services/axios";
import type { ApiResponse } from "shared/types";

const useResetPassRequest = () => {
  const resetPassword = async (email: string) => {
    try {
      const resp = await axios.get<ApiResponse>(`/auth/requestPasswordChange/${email}`);

      return resp;
    } catch (err) {
      throw err;
    }
  };
  return [resetPassword] as const;
};

export default useResetPassRequest;
