import axios from "shared/services/axios";
import type { ApiResponse } from "shared/types";

const useResetPassRequest = () => {
  const resetPassword = async (email: string) => {
    const resp = await axios.get<ApiResponse>(`/auth/requestPasswordChange/${email}`);

    return resp;
  };
  return [resetPassword] as const;
};

export default useResetPassRequest;
