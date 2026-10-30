export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const ACCESS_TOKEN = "accessToken";

export const OAUTH2_REDIRECT_URI = import.meta.env.VITE_OAUTH2_REDIRECT_URI;

export const GOOGLE_AUTH_URL =
  API_BASE_URL + "/oauth2/authorize/google?redirect_uri=" + OAUTH2_REDIRECT_URI;
