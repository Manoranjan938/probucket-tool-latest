import { SET_CURRENT_USER } from "apis/Actions/types";

const initialState = {
  user: {},
  validToken: false,
};

const booleanActionPayload = (payload) => {
  if (payload) {
    return true;
  } else {
    return false;
  }
};

const setUser = (state = initialState, action) => {
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
