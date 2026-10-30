import jwt_decode from "jwt-decode";
import setJWTToken from "Security/setJWTToken";
import { SET_CURRENT_USER } from "./types";

export const login = (token) => async (dispatch) => {
  try {
    //const token = localStorage.getItem("jwtToken")
    const decoded = jwt_decode(token);

    dispatch({
      type: SET_CURRENT_USER,
      payload: decoded,
    });
  } catch (err) {
    console.log(err);
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("jwtToken");
  setJWTToken(false);
  dispatch({
    type: SET_CURRENT_USER,
    payload: {},
  });
};
