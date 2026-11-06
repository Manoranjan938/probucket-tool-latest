import axios, { type AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "shared/constants/constant";
import type { ApiError } from "shared/types";

// Answers 401 for anyone not logged in, which is normal on public pages like the landing page
export const CURRENT_USER_URL = "/auth/me";

const REFRESH_URL = "/auth/refresh";

// Every page waits for the session check, which can include a refresh, so a backend that hangs must not block them for long
const REFRESH_TIMEOUT_MS = 10000;

const instance = axios.create({
  baseURL: API_BASE_URL,
  // The browser attaches the backend's HttpOnly login cookies
  withCredentials: true,
});

// Requests that fail together share one refresh, because using a refresh token retires it
let refreshing: Promise<unknown> | null = null;

const refreshSession = () => {
  refreshing ??= instance.post(REFRESH_URL, undefined, { timeout: REFRESH_TIMEOUT_MS }).finally(() => {
    refreshing = null;
  });
  return refreshing;
};

const goToLogin = (url?: string) => {
  if (url !== CURRENT_USER_URL) {
    window.location.href = "/login";
  }
};

// The access token is missing, expired or invalid: get a new one and repeat the request once.
// Back to the login page if the session has really ended.
// Wrong credentials on the login form have their own code, INVALID_CREDENTIALS, and stay on the form.
instance.interceptors.response.use(undefined, async (err: ApiError) => {
  const config = err.config as AxiosRequestConfig & { retried?: boolean };

  // A blob request (e.g. an attachment image) gets its error body as a Blob, so only its status can tell
  const unauthorized =
    err.response?.data?.code === "UNAUTHORIZED" || (config.responseType === "blob" && err.response?.status === 401);
  if (!unauthorized || config.url === REFRESH_URL) {
    return Promise.reject(err);
  }

  if (config.retried) {
    goToLogin(config.url);
    return Promise.reject(err);
  }

  try {
    await refreshSession();
  } catch (refreshErr) {
    // No answer, e.g. a network error, says nothing about the session
    if ((refreshErr as ApiError).response?.status === 401) {
      goToLogin(config.url);
    }
    return Promise.reject(err);
  }

  config.retried = true;
  return instance(config);
});

export default instance;
