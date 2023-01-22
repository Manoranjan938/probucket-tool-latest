import { SET_ALL_PROJECTS, SET_PROJECT_DETAILS } from "./types";

export const getAllProjects = (projectData) => async (dispatch) => {
  try {
    dispatch({
      type: SET_ALL_PROJECTS,
      payload: projectData,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getProjectDetails = (projectDetails) => async (dispatch) => {
  try {
    dispatch({
      type: SET_PROJECT_DETAILS,
      payload: projectDetails,
    });
  } catch (err) {
    console.log(err);
  }
};
