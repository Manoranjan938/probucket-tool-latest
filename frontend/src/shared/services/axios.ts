import axios from "axios";
import { API_BASE_URL } from "shared/constants/constant";
import type { ApiError } from "shared/types";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

// The token is missing, expired or invalid: back to the login page.
// Wrong credentials on the login form have their own code, INVALID_CREDENTIALS, and stay on the form.
instance.interceptors.response.use(undefined, (err: ApiError) => {
  if (err.response?.data?.code === "UNAUTHORIZED") {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  }
  return Promise.reject(err);
});

export default instance;
