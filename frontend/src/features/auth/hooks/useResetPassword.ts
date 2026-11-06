import axios from "shared/services/axios";
import type { ApiResponse } from "shared/types";

const useResetPassword = () => {
  const resetMyPassword = async (token: string | null, pass: string) => {
    const resp = await axios.post<ApiResponse>(
      `/auth/resetMyPassword?token=${token}&pass=${pass}`
    );

    return resp;
  };

  return [resetMyPassword] as const;
};

export default useResetPassword;
