import type { Dispatch } from "redux";
import { SET_COMMENT_LIST } from "shared/store/types";
import type { Comment } from "features/comments/types";
import type { CommentAction } from "./commentReducers";

export const setAllComments = (commentData: Comment[]) => async (dispatch: Dispatch<CommentAction>) => {
  try {
    dispatch({
      type: SET_COMMENT_LIST,
      payload: commentData,
    });
  } catch (err) {
    console.log(err);
  }
};
