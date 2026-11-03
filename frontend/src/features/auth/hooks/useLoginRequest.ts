import axios from "shared/services/axios";
import type { AuthUser, LoginRequest } from "features/auth/types";
import type { ApiResponse } from "shared/types";

const useLoginRequest = () => {
  const loginRequest = async (LoginRequest: LoginRequest) => {
    try {
      // The backend sets the login cookie on this response and returns the logged-in user
      const res = await axios.post<ApiResponse<AuthUser>>("/auth/login", LoginRequest);

      return res;
    } catch (err) {
      //console.log(err.response);
      throw err;
    }
  };

  return [loginRequest] as const;
};

export default useLoginRequest;
