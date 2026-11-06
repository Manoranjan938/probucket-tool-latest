import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TaskState } from "features/tasks/types";

const initialState: TaskState = {
  selectedTaskSequence: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    selectTask: (state, action: PayloadAction<string>) => {
      state.selectedTaskSequence = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTaskSequence = null;
    },
  },
});

export const { selectTask, clearSelectedTask } = tasksSlice.actions;

export default tasksSlice.reducer;
