import { api, responseData } from "shared/services/api";
import type {
  Attachment,
  CreatedTask,
  CreateSubtaskRequest,
  ProjectTaskRequest,
  Subtask,
  TaskDetails,
  TaskListItem,
  TaskStatistics,
  UpdateAssigneeRequest,
  UpdateBugDetailsRequest,
  UpdateDueDateRequest,
  UpdateEstimateRequest,
  UpdateLabelsRequest,
  UpdateStartDateRequest,
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
    // Labels used anywhere in the project, offered as suggestions
    getProjectLabels: build.query<string[], string>({
      query: (projectIdentifier) => ({ url: `/task/getLabels/${projectIdentifier}` }),
      transformResponse: responseData<string[]>,
      providesTags: ["Task"],
    }),
    getAttachments: build.query<Attachment[], string>({
      query: (sequence) => ({ url: `/task/getAttachments/${sequence}` }),
      transformResponse: responseData<Attachment[]>,
      providesTags: ["Attachment"],
    }),
    // The images go as multipart form data; the browser sets its content type
    uploadAttachments: build.mutation<ApiResponse, { taskId: string; files: File[] }>({
      query: ({ taskId, files }) => {
        const form = new FormData();
        files.forEach((file) => form.append("files", file, file.name));
        return { url: `/task/uploadAttachments/${taskId}`, method: "POST", data: form, timeout: 120000 };
      },
      invalidatesTags: ["Attachment", "Activity"],
    }),
    deleteAttachment: build.mutation<ApiResponse, string>({
      query: (attachmentId) => ({ url: `/task/deleteAttachment/${attachmentId}`, method: "POST" }),
      invalidatesTags: ["Attachment", "Activity"],
    }),
    createTask: build.mutation<ApiResponse<CreatedTask>, ProjectTaskRequest>({
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
    updateAssignee: build.mutation<ApiResponse, UpdateAssigneeRequest>({
      query: (request) => ({ url: "/task/updateAssignee", method: "POST", data: request }),
      invalidatesTags: taskChanges,
    }),
    updateStartDate: build.mutation<ApiResponse, UpdateStartDateRequest>({
      query: (request) => ({ url: "/task/updateStartDate", method: "POST", data: request }),
      invalidatesTags: taskChanges,
    }),
    updateEstimate: build.mutation<ApiResponse, UpdateEstimateRequest>({
      query: (request) => ({ url: "/task/updateEstimate", method: "POST", data: request }),
      invalidatesTags: taskChanges,
    }),
    updateLabels: build.mutation<ApiResponse, UpdateLabelsRequest>({
      query: (request) => ({ url: "/task/updateLabels", method: "POST", data: request }),
      invalidatesTags: taskChanges,
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskDetailsQuery,
  useGetSubtasksQuery,
  useGetTaskStatisticsQuery,
  useGetProjectLabelsQuery,
  useGetAttachmentsQuery,
  useUploadAttachmentsMutation,
  useDeleteAttachmentMutation,
  useCreateTaskMutation,
  useCreateSubtaskMutation,
  useUpdateTaskMutation,
  useUpdateBugDetailsMutation,
  useUpdateDueDateMutation,
  useUpdateAssigneeMutation,
  useUpdateStartDateMutation,
  useUpdateEstimateMutation,
  useUpdateLabelsMutation,
} = tasksApi;
