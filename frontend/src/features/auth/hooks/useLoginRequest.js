import axios from "Services/axios";
import setJWTToken from "Security/setJWTToken";
import { useState } from "react";

const useLoginRequest = () => {
  const [tokens, setToken] = useState("");
  const loginRequest = async (LoginRequest) => {
    try {
      const res = await axios.post("/auth/login", LoginRequest);
      const { token } = res.data;
      setToken(token);
      localStorage.setItem("jwtToken", token);
      setJWTToken(token);

      return res;
    } catch (err) {
      //console.log(err.response);
      throw err;
    }
  };

  return [tokens, loginRequest];
};

export default useLoginRequest;
