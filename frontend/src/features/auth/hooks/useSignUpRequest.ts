import axios from "shared/services/axios";
import type { UserRequest } from "features/auth/types";
import type { ApiResponse } from "shared/types";

const useSignUpRequest = () => {
  const register = async (RegisterRequest: UserRequest) => {
    try {
      const res = await axios.post<ApiResponse>("/auth/newUser", RegisterRequest);

      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  return [register] as const;
};

export default useSignUpRequest;
