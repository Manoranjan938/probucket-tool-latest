import {
  SET_TASK_LISTS,
  SET_SINGLE_TASK,
  SET_SUBTASK_LIST,
  SET_SELECTED_SUBTASK,
  REMOVE_TASK_DETAILS,
} from "shared/store/types";
import type {
  Subtask,
  TaskDetails,
  TaskListItem,
  TaskState,
} from "features/tasks/types";

export type TaskAction =
  | { type: typeof SET_TASK_LISTS; payload: TaskListItem[] | undefined }
  | { type: typeof SET_SINGLE_TASK; payload: Partial<TaskDetails> }
  | { type: typeof SET_SUBTASK_LIST; payload: Subtask[] }
  | { type: typeof SET_SELECTED_SUBTASK; payload: Partial<Subtask> }
  | { type: typeof REMOVE_TASK_DETAILS; payload: Partial<TaskDetails> };

const initialState: TaskState = {
  allTask: [],
  selectedTask: {},
  allSubtasks: [],
  selectedSubtask: {},
};

const setAllTasks = (state = initialState, action: TaskAction): TaskState => {
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
