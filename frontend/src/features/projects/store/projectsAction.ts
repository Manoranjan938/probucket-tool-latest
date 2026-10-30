import type { Dispatch } from "redux";
import { SET_ALL_PROJECTS, SET_PROJECT_DETAILS } from "shared/store/types";
import type { Project } from "features/projects/types";
import type { ProjectAction } from "./projectReducers";

export const getAllProjects = (projectData: Project[]) => async (dispatch: Dispatch<ProjectAction>) => {
  try {
    dispatch({
      type: SET_ALL_PROJECTS,
      payload: projectData,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getProjectDetails = (projectDetails: Partial<Project>) => async (dispatch: Dispatch<ProjectAction>) => {
  try {
    dispatch({
      type: SET_PROJECT_DETAILS,
      payload: projectDetails,
    });
  } catch (err) {
    console.log(err);
  }
};
