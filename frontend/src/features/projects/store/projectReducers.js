import { SET_ALL_PROJECTS, SET_PROJECT_DETAILS } from "apis/Actions/types";

const initialState = {
  allProjects: [],
  project: {},
};

const setAllProjects = (state = initialState, action) => {
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
