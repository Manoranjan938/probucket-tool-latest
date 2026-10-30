import {
  REMOVE_TASK_DETAILS,
  SET_SELECTED_SUBTASK,
  SET_SINGLE_TASK,
  SET_SUBTASK_LIST,
  SET_TASK_LISTS,
} from "./types";

export const getAllTask = (taskList) => (dispatch) => {
  dispatch({
    type: SET_TASK_LISTS,
    payload: taskList,
  });
};

export const getSingleTask = (task) => (dispatch) => {
  dispatch({
    type: SET_SINGLE_TASK,
    payload: task,
  });
};

export const removeSelectedTask = () => (dispatch) => {
  dispatch({
    type: REMOVE_TASK_DETAILS,
    payload: {}
  })
}

export const setSubtaskList = (subtaskList) => (dispatch) => {
  dispatch({
    type: SET_SUBTASK_LIST,
    payload: subtaskList,
  });
};

export const setSelectedSubtask = (subtask) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_SUBTASK,
    payload: subtask,
  });
};
