import axios from "axios";
import { API_BASE_URL } from "shared/constants/constant";
import type { ApiError } from "shared/types";

// Answers 401 for anyone not logged in, which is normal on public pages like the landing page
export const CURRENT_USER_URL = "/auth/me";

const instance = axios.create({
  baseURL: API_BASE_URL,
  // The browser attaches the backend's HttpOnly login cookie to every request
  withCredentials: true,
});

// The token is missing, expired or invalid: back to the login page.
// Wrong credentials on the login form have their own code, INVALID_CREDENTIALS, and stay on the form.
instance.interceptors.response.use(undefined, (err: ApiError) => {
  if (err.response?.data?.code === "UNAUTHORIZED" && err.config?.url !== CURRENT_USER_URL) {
    window.location.href = "/login";
  }
  return Promise.reject(err);
});

export default instance;
