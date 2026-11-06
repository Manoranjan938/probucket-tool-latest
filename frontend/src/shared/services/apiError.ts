import type { ApiRequestError } from "shared/services/api";

/**
 * The text to show for a failed request (what unwrap() throws): the first field error, else the backend's message.
 * Server errors and requests without a response (e.g. network errors) use the fallback.
 */
export const getApiErrorMessage = (err: unknown, fallback = "Something went wrong. Please try again.") => {
  const body = (err as ApiRequestError).data;
  if (!body || body.status >= 500) {
    return fallback;
  }
  return Object.values(body.errors ?? {})[0] || body.message || fallback;
};
