import { api, responseData } from "shared/services/api";
import { CURRENT_USER_URL } from "shared/services/axios";
import type { AuthUser, LoginRequest, UserRequest } from "features/auth/types";
import type { ApiResponse } from "shared/types";

// Every page waits for the session check, so a backend that hangs must not block them for long
const SESSION_CHECK_TIMEOUT_MS = 10000;

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Who the login cookie belongs to
    getCurrentUser: build.query<AuthUser, void>({
      query: () => ({ url: CURRENT_USER_URL, timeout: SESSION_CHECK_TIMEOUT_MS }),
      transformResponse: responseData<AuthUser>,
    }),
    // The backend sets the login cookie on this response and returns the logged-in user
    login: build.mutation<ApiResponse<AuthUser>, LoginRequest>({
      query: (loginRequest) => ({ url: "/auth/login", method: "POST", data: loginRequest }),
    }),
    // JavaScript can't touch an HttpOnly cookie, so only the backend can clear it
    logout: build.mutation<ApiResponse, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    logoutEverywhere: build.mutation<ApiResponse, void>({
      query: () => ({ url: "/auth/logoutEverywhere", method: "POST" }),
    }),
    signUp: build.mutation<ApiResponse, UserRequest>({
      query: (registerRequest) => ({ url: "/auth/newUser", method: "POST", data: registerRequest }),
    }),
    verifyAccount: build.mutation<ApiResponse, string>({
      query: (token) => ({ url: "/auth/verify", params: { token } }),
    }),
    requestPasswordChange: build.mutation<ApiResponse, string>({
      query: (email) => ({ url: `/auth/requestPasswordChange/${email}` }),
    }),
    resetPassword: build.mutation<ApiResponse, { token: string | null; pass: string }>({
      // TODO(ts-migration): token and pass aren't URL-encoded, so a password containing & or + arrives changed
      query: ({ token, pass }) => ({ url: `/auth/resetMyPassword?token=${token}&pass=${pass}`, method: "POST" }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useVerifyAccountMutation,
  useRequestPasswordChangeMutation,
  useResetPasswordMutation,
} = authApi;

export default authApi;
