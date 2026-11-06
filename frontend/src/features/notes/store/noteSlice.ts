import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NoteListItem, NoteState } from "features/notes/types";

const initialState: NoteState = {
  allNotes: [],
};

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setAllNotes: (state, action: PayloadAction<NoteListItem[]>) => {
      state.allNotes = action.payload;
    },
  },
});

export const { setAllNotes } = noteSlice.actions;

export default noteSlice.reducer;
