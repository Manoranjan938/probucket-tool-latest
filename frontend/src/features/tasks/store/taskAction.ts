import type { Dispatch } from "redux";
import {
  REMOVE_TASK_DETAILS,
  SET_SELECTED_SUBTASK,
  SET_SINGLE_TASK,
  SET_SUBTASK_LIST,
  SET_TASK_LISTS,
} from "shared/store/types";
import type { Subtask, TaskDetails, TaskListItem } from "features/tasks/types";
import type { TaskAction } from "./taskReducers";

export const getAllTask = (taskList: TaskListItem[] | undefined) => (dispatch: Dispatch<TaskAction>) => {
  dispatch({
    type: SET_TASK_LISTS,
    payload: taskList,
  });
};

export const getSingleTask = (task: Partial<TaskDetails>) => (dispatch: Dispatch<TaskAction>) => {
  dispatch({
    type: SET_SINGLE_TASK,
    payload: task,
  });
};

export const removeSelectedTask = () => (dispatch: Dispatch<TaskAction>) => {
  dispatch({
    type: REMOVE_TASK_DETAILS,
    payload: {}
  })
}

export const setSubtaskList = (subtaskList: Subtask[]) => (dispatch: Dispatch<TaskAction>) => {
  dispatch({
    type: SET_SUBTASK_LIST,
    payload: subtaskList,
  });
};

export const setSelectedSubtask = (subtask: Partial<Subtask>) => (dispatch: Dispatch<TaskAction>) => {
  dispatch({
    type: SET_SELECTED_SUBTASK,
    payload: subtask,
  });
};
