import type { UnknownAction } from "@reduxjs/toolkit";
import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { AxiosRequestConfig } from "axios";
import axios from "shared/services/axios";
import type { ApiError, ApiErrorCode, ApiResponse } from "shared/types";

export interface ApiRequest {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: unknown;
  params?: AxiosRequestConfig["params"];
  timeout?: number;
  /** Some list endpoints answer 400 with this code instead of an empty list */
  emptyListCode?: ApiErrorCode;
}

/** A failed request as RTK Query stores it. Both are missing when there was no answer, e.g. a network error. */
export interface ApiRequestError {
  status?: number;
  data?: ApiResponse;
}

// Sends every request through the axios instance, so its refresh-and-retry on an expired login still applies.
// The result is the whole response body; queries pick out its data with transformResponse.
const axiosBaseQuery: BaseQueryFn<ApiRequest, ApiResponse<unknown>, ApiRequestError> = async ({
  emptyListCode,
  ...config
}) => {
  try {
    const res = await axios.request<ApiResponse<unknown>>(config);
    return { data: res.data };
  } catch (err) {
    const { response } = err as ApiError;
    if (emptyListCode && response?.data?.code === emptyListCode) {
      return { data: { ...response.data, data: [] } };
    }
    // The store only keeps plain data, so the axios error itself isn't stored
    return { error: { status: response?.status, data: response?.data } };
  }
};

// Each feature adds its endpoints in features/<feature>/api with injectEndpoints
export const api = createApi({
  baseQuery: axiosBaseQuery,
  tagTypes: ["Project", "Task", "Activity", "Comment", "Note", "TeamMember", "Attachment"],
  endpoints: () => ({}),
});

// Activity entries are saved by a background job on the server, a moment after the change itself
export const ACTIVITY_RELOAD_DELAY_MS = 1500;

/**
 * For changes that are recorded in the activity: besides the usual reload when the change succeeds,
 * activity is reloaded once more shortly after, to pick up the entry the server saves in the background.
 */
export const reloadActivityLater = async (
  _arg: unknown,
  { dispatch, queryFulfilled }: { dispatch: (action: UnknownAction) => unknown; queryFulfilled: Promise<unknown> },
) => {
  try {
    await queryFulfilled;
  } catch {
    return;
  }
  setTimeout(() => dispatch(api.util.invalidateTags(["Activity"])), ACTIVITY_RELOAD_DELAY_MS);
};

/** Picks the data out of the response body */
export const responseData = <T>(res: ApiResponse<T>) => res.data;
