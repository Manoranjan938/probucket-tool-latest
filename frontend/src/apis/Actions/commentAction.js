import { SET_COMMENT_LIST } from "./types";

export const setAllComments = (commentData) => async (dispatch) => {
  try {
    dispatch({
      type: SET_COMMENT_LIST,
      payload: commentData,
    });
  } catch (err) {
    console.log(err);
  }
};
