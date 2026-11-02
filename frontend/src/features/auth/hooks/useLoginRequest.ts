import axios from "shared/services/axios";
import setJWTToken from "features/auth/utils/setJWTToken";
import { useState } from "react";
import type { LoginRequest, LoginResponse } from "features/auth/types";
import type { ApiResponse } from "shared/types";

const useLoginRequest = () => {
  const [tokens, setToken] = useState("");
  const loginRequest = async (LoginRequest: LoginRequest) => {
    try {
      const res = await axios.post<ApiResponse<LoginResponse>>("/auth/login", LoginRequest);
      const { token } = res.data.data;
      setToken(token);
      localStorage.setItem("jwtToken", token);
      setJWTToken(token);

      return res;
    } catch (err) {
      //console.log(err.response);
      throw err;
    }
  };

  return [tokens, loginRequest] as const;
};

export default useLoginRequest;
