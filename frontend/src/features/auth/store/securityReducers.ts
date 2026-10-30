import { SET_CURRENT_USER } from "shared/store/types";
import type { JwtUser, SecurityState } from "features/auth/types";

export type SecurityAction = {
  type: typeof SET_CURRENT_USER;
  payload: Partial<JwtUser>;
};

const initialState: SecurityState = {
  user: {},
  validToken: false,
};

const booleanActionPayload = (payload: Partial<JwtUser>) => {
  if (payload) {
    return true;
  } else {
    return false;
  }
};

const setUser = (state = initialState, action: SecurityAction): SecurityState => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        validToken: booleanActionPayload(action.payload),
        user: action.payload,
      };

    default:
      return state;
  }
};

export default setUser;
