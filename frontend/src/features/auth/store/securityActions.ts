import type { Dispatch } from "redux";
import axios, { CURRENT_USER_URL } from "shared/services/axios";
import { SET_CURRENT_USER } from "shared/store/types";
import type { AuthUser } from "features/auth/types";
import type { ApiResponse } from "shared/types";
import type { SecurityAction } from "./securityReducers";

// Every page waits for the session check, so a backend that hangs must not block them for long
const SESSION_CHECK_TIMEOUT_MS = 10000;

export const login = (user: AuthUser): SecurityAction => ({
  type: SET_CURRENT_USER,
  payload: user,
});

// Asks the backend who the login cookie belongs to. Any failure means nobody is logged in, so this never rejects.
export const restoreSession = () => async (dispatch: Dispatch<SecurityAction>) => {
  try {
    const res = await axios.get<ApiResponse<AuthUser>>(CURRENT_USER_URL, { timeout: SESSION_CHECK_TIMEOUT_MS });
    dispatch(login(res.data.data));
  } catch {
    // The store already holds the logged-out state
  }
};

// JavaScript can't touch an HttpOnly cookie, so only the backend can clear it.
// These reject if that fails, because the user would still be logged in.
export const logout = () => async (dispatch: Dispatch<SecurityAction>) => {
  await axios.post("/auth/logout");
  dispatch({
    type: SET_CURRENT_USER,
    payload: {},
  });
};

export const logoutEverywhere = () => async (dispatch: Dispatch<SecurityAction>) => {
  await axios.post("/auth/logoutEverywhere");
  dispatch({
    type: SET_CURRENT_USER,
    payload: {},
  });
};
