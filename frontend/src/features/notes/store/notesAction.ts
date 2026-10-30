import type { Dispatch } from "redux";
import { SET_NOTES_LIST } from "shared/store/types";
import type { NoteListItem } from "features/notes/types";
import type { NoteAction } from "./notesReducers";

export const getAllNotes = (noteData: NoteListItem[]) => async (dispatch: Dispatch<NoteAction>) => {
  try {
    dispatch({
      type: SET_NOTES_LIST,
      payload: noteData,
    });
  } catch (err) {
    console.log(err);
  }
};
