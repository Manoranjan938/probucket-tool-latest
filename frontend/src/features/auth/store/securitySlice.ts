import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios, { CURRENT_USER_URL } from "shared/services/axios";
import type { AppThunk, RootState } from "app/store";
import type { AuthUser, SecurityState } from "features/auth/types";
import type { ApiResponse } from "shared/types";

// Every page waits for the session check, so a backend that hangs must not block them for long
const SESSION_CHECK_TIMEOUT_MS = 10000;

const initialState: SecurityState = {
  user: {},
};

const securitySlice = createSlice({
  name: "security",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = {};
    },
  },
});

export const { setUser, clearUser } = securitySlice.actions;

// The user is an empty object while nobody is logged in
export const selectIsLoggedIn = (state: RootState) => Boolean(state.security.user.id);

// Asks the backend who the login cookie belongs to. Any failure means nobody is logged in, so this never rejects.
export const restoreSession = (): AppThunk<Promise<void>> => async (dispatch) => {
  try {
    const res = await axios.get<ApiResponse<AuthUser>>(CURRENT_USER_URL, { timeout: SESSION_CHECK_TIMEOUT_MS });
    dispatch(setUser(res.data.data));
  } catch {
    // The store already holds the logged-out state
  }
};

// JavaScript can't touch an HttpOnly cookie, so only the backend can clear it.
// These reject with the axios error if that fails, because the user would still be logged in.
export const logout = (): AppThunk<Promise<void>> => async (dispatch) => {
  await axios.post("/auth/logout");
  dispatch(clearUser());
};

export const logoutEverywhere = (): AppThunk<Promise<void>> => async (dispatch) => {
  await axios.post("/auth/logoutEverywhere");
  dispatch(clearUser());
};

export default securitySlice.reducer;
