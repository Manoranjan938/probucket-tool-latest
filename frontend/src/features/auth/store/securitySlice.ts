import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "shared/services/api";
import authApi from "features/auth/api/authApi";
import type { AppThunk, RootState } from "app/store";
import type { AuthUser, SecurityState } from "features/auth/types";

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
  const { data } = await dispatch(authApi.endpoints.getCurrentUser.initiate(undefined, { subscribe: false }));
  if (data) {
    dispatch(setUser(data));
  }
};

// The cache is emptied too, so whoever logs in next never sees this user's data
const clearSession = (): AppThunk => (dispatch) => {
  dispatch(clearUser());
  dispatch(api.util.resetApiState());
};

// These reject if the backend couldn't end the session, because the user would still be logged in
export const logout = (): AppThunk<Promise<void>> => async (dispatch) => {
  await dispatch(authApi.endpoints.logout.initiate()).unwrap();
  dispatch(clearSession());
};

export const logoutEverywhere = (): AppThunk<Promise<void>> => async (dispatch) => {
  await dispatch(authApi.endpoints.logoutEverywhere.initiate()).unwrap();
  dispatch(clearSession());
};

export default securitySlice.reducer;
