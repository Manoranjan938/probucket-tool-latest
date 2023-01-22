import { SET_NOTES_LIST } from "./types";

export const getAllNotes = (noteData) => async (dispatch) => {
  try {
    dispatch({
      type: SET_NOTES_LIST,
      payload: noteData,
    });
  } catch (err) {
    console.log(err);
  }
};
