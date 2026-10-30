import type { ApiErrorResponse } from "shared/types";
import { SET_ERRORS } from "./types";

export type ErrorAction = { type: typeof SET_ERRORS; payload: ApiErrorResponse };

const initialState: ApiErrorResponse = {};

const setErrors = (
  state = initialState,
  action: ErrorAction
): ApiErrorResponse => {
  switch (action.type) {
    case SET_ERRORS:
      return action.payload;

    default:
      return state;
  }
};

export default setErrors;
