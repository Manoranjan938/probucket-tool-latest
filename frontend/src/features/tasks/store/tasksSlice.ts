import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Subtask, TaskDetails, TaskListItem, TaskState } from "features/tasks/types";

const initialState: TaskState = {
  allTask: [],
  selectedTask: {},
  allSubtasks: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setAllTasks: (state, action: PayloadAction<TaskListItem[] | undefined>) => {
      state.allTask = action.payload;
    },
    setSelectedTask: (state, action: PayloadAction<Partial<TaskDetails>>) => {
      state.selectedTask = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = {};
    },
    setAllSubtasks: (state, action: PayloadAction<Subtask[]>) => {
      state.allSubtasks = action.payload;
    },
  },
});

export const { setAllTasks, setSelectedTask, clearSelectedTask, setAllSubtasks } = tasksSlice.actions;

export default tasksSlice.reducer;
