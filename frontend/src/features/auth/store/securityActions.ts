import jwt_decode from "jwt-decode";
import type { Dispatch } from "redux";
import setJWTToken from "features/auth/utils/setJWTToken";
import { SET_CURRENT_USER } from "shared/store/types";
import type { JwtUser } from "features/auth/types";
import type { SecurityAction } from "./securityReducers";

export const login = (token: string) => async (dispatch: Dispatch<SecurityAction>) => {
  try {
    //const token = localStorage.getItem("jwtToken")
    const decoded = jwt_decode<JwtUser>(token);

    dispatch({
      type: SET_CURRENT_USER,
      payload: decoded,
    });
  } catch (err) {
    console.log(err);
  }
};

export const logout = () => (dispatch: Dispatch<SecurityAction>) => {
  localStorage.removeItem("jwtToken");
  setJWTToken(false);
  dispatch({
    type: SET_CURRENT_USER,
    payload: {},
  });
};
