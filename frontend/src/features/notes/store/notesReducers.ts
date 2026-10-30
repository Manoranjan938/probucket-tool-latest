import { SET_NOTES_LIST } from "shared/store/types";
import type { NoteListItem, NoteState } from "features/notes/types";

export type NoteAction = { type: typeof SET_NOTES_LIST; payload: NoteListItem[] };

const initialState: NoteState = {
  allNotes: [],
  note: {},
};

const setAllNotes = (state = initialState, action: NoteAction): NoteState => {
  switch (action.type) {
    case SET_NOTES_LIST:
      return {
        ...state,
        allNotes: action.payload,
      };

    default:
      return state;
  }
};

export default setAllNotes;
