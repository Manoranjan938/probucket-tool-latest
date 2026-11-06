import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Project, ProjectState } from "features/projects/types";

const initialState: ProjectState = {
  allProjects: [],
  project: {},
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setAllProjects: (state, action: PayloadAction<Project[]>) => {
      state.allProjects = action.payload;
    },
    setCurrentProject: (state, action: PayloadAction<Partial<Project>>) => {
      state.project = action.payload;
    },
  },
});

export const { setAllProjects, setCurrentProject } = projectSlice.actions;

export default projectSlice.reducer;
