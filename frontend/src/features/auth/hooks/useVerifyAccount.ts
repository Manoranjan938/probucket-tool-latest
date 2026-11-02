import axios from "shared/services/axios";
import type { ApiResponse } from "shared/types";

const useVerifyAccount = () => {
  const verifyAccount = async (token: string) => {
    try {
      const resp = await axios.get<ApiResponse>("/auth/verify", { params: { token } });

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [verifyAccount] as const;
};

export default useVerifyAccount;
