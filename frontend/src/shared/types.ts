import type { AlertColor, SnackbarOrigin } from "@mui/material";
import type { AxiosError } from "axios";

/** Field -> message map the backend sends for validation and auth errors */
export type ApiErrorResponse = Record<string, string>;

export type ApiError = AxiosError<ApiErrorResponse>;

/** State behind the Snackbar + Alert used on most forms */
export interface SnackbarState {
  open: boolean;
  vertical?: SnackbarOrigin["vertical"];
  horizontal?: SnackbarOrigin["horizontal"];
  type?: AlertColor | "";
  message?: string;
}
