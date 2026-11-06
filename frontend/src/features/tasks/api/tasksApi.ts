import { api, responseData } from "shared/services/api";
import type {
  CreateSubtaskRequest,
  ProjectTaskRequest,
  Subtask,
  TaskDetails,
  TaskListItem,
  TaskStatistics,
  UpdateBugDetailsRequest,
  UpdateDueDateRequest,
  UpdateTaskRequest,
} from "features/tasks/types";
import type { ApiResponse } from "shared/types";

// A change to one task can change the board, the task, its parent's subtasks and progress, the counts and the history,
// so every task query provides "Task" and every change reloads them all
const taskChanges = ["Task", "Activity"] as const;

const tasksApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<TaskListItem[], string | null>({
      query: (projectIdentifier) => ({ url: `/task/getTasks/${projectIdentifier}`, emptyListCode: "TASK_NOT_FOUND" }),
      transformResponse: responseData<TaskListItem[]>,
      providesTags: ["Task"],
    }),
    getTaskDetails: build.query<TaskDetails, string>({
      query: (sequence) => ({ url: `/task/getTaskDetails/${sequence}` }),
      transformResponse: responseData<TaskDetails>,
      providesTags: ["Task"],
    }),
    getSubtasks: build.query<Subtask[], string>({
      query: (sequence) => ({ url: `/task/getSubtaskList/${sequence}` }),
      transformResponse: responseData<Subtask[]>,
      providesTags: ["Task"],
    }),
    getTaskStatistics: build.query<TaskStatistics, string>({
      query: (sequence) => ({ url: `/task/getStatistics/${sequence}` }),
      transformResponse: responseData<TaskStatistics>,
      providesTags: ["Task"],
    }),
    createTask: build.mutation<ApiResponse, ProjectTaskRequest>({
      query: (taskRequest) => ({ url: "/task/createTask", method: "POST", data: taskRequest }),
      invalidatesTags: taskChanges,
    }),
    createSubtask: build.mutation<ApiResponse, CreateSubtaskRequest>({
      query: (subtask) => ({ url: "/task/createSubTask", method: "POST", data: subtask }),
      invalidatesTags: taskChanges,
    }),
    updateTask: build.mutation<ApiResponse, UpdateTaskRequest>({
      query: (updateRequest) => ({ url: "/task/updateTask", method: "POST", data: updateRequest }),
      invalidatesTags: taskChanges,
    }),
    updateBugDetails: build.mutation<ApiResponse, UpdateBugDetailsRequest>({
      query: (request) => ({ url: "/task/updateBugDetails", method: "POST", data: request }),
      invalidatesTags: taskChanges,
    }),
    updateDueDate: build.mutation<ApiResponse, UpdateDueDateRequest>({
      query: (request) => ({ url: "/task/updateDueDate", method: "POST", data: request }),
      invalidatesTags: taskChanges,
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskDetailsQuery,
  useGetSubtasksQuery,
  useGetTaskStatisticsQuery,
  useCreateTaskMutation,
  useCreateSubtaskMutation,
  useUpdateTaskMutation,
  useUpdateBugDetailsMutation,
  useUpdateDueDateMutation,
} = tasksApi;
