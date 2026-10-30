import { SET_ALL_PROJECTS, SET_PROJECT_DETAILS } from "shared/store/types";
import type { Project, ProjectState } from "features/projects/types";

export type ProjectAction =
  | { type: typeof SET_ALL_PROJECTS; payload: Project[] }
  | { type: typeof SET_PROJECT_DETAILS; payload: Partial<Project> };

const initialState: ProjectState = {
  allProjects: [],
  project: {},
};

const setAllProjects = (state = initialState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case SET_ALL_PROJECTS:
      return {
        ...state,
        allProjects: action.payload,
      };

    case SET_PROJECT_DETAILS:
      return {
        ...state,
        project: action.payload,
      };

    default:
      return state;
  }
};

export default setAllProjects;
