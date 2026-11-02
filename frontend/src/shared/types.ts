import type { AlertColor, SnackbarOrigin } from "@mui/material";
import type { AxiosError } from "axios";

/** Field -> message map, the `errors` of a validation failure */
export type ApiErrorResponse = Record<string, string>;

/** exception/ApiErrorCode.java */
export type ApiErrorCode =
  | "VALIDATION_FAILED"
  | "BAD_REQUEST"
  | "USER_ALREADY_EXISTS"
  | "USER_NOT_FOUND"
  | "PROJECT_NOT_FOUND"
  | "TASK_NOT_FOUND"
  | "DATA_NOT_FOUND"
  | "INVALID_CREDENTIALS"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "INTERNAL_ERROR";

/** model/response/ApiResponse.java – the structure of every API response */
export interface ApiResponse<T = null> {
  success: boolean;
  status: number;
  /** null on success */
  code: ApiErrorCode | null;
  message: string;
  data: T;
  errors: ApiErrorResponse | null;
}

export type ApiError = AxiosError<ApiResponse>;

/** State behind the Snackbar + Alert used on most forms */
export interface SnackbarState {
  open: boolean;
  vertical?: SnackbarOrigin["vertical"];
  horizontal?: SnackbarOrigin["horizontal"];
  type?: AlertColor | "";
  message?: string;
}
