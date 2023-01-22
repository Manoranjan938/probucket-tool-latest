import {
  SET_TASK_LISTS,
  SET_SINGLE_TASK,
  SET_SUBTASK_LIST,
  SET_SELECTED_SUBTASK,
  REMOVE_TASK_DETAILS,
} from "apis/Actions/types";

const initialState = {
  allTask: [],
  selectedTask: {},
  allSubtasks: [],
  selectedSubtask: {},
};

const setAllTasks = (state = initialState, action) => {
  switch (action.type) {
    case SET_TASK_LISTS:
      return {
        ...state,
        allTask: action.payload,
      };

    case SET_SINGLE_TASK:
      return {
        ...state,
        selectedTask: action.payload,
      };

    case SET_SUBTASK_LIST:
      return {
        ...state,
        allSubtasks: action.payload,
      };

    case SET_SELECTED_SUBTASK:
      return {
        ...state,
        selectedSubtask: action.payload,
      };

    case REMOVE_TASK_DETAILS:
      return {
        ...state,
        selectedTask: action.payload,
      };

    default:
      return state;
  }
};

export default setAllTasks;
