import { SET_COMMENT_LIST } from "shared/store/types";
import type { Comment, CommentState } from "features/comments/types";

export type CommentAction = { type: typeof SET_COMMENT_LIST; payload: Comment[] };

const initialState: CommentState = {
  commentList: [],
};

const setAllComments = (state = initialState, action: CommentAction): CommentState => {
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
