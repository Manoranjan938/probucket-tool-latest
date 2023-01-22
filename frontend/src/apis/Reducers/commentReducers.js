import { SET_COMMENT_LIST } from "apis/Actions/types";

const initialState = {
  commentList: [],
};

const setAllComments = (state = initialState, action) => {
  switch (action.type) {
    case SET_COMMENT_LIST:
      return {
        ...state,
        commentList: action.payload,
      };

    default:
      return state;
  }
};

export default setAllComments;
