/** model/response/SubtaskList.java */
export interface Subtask {
  taskName: string;
  taskType: string;
  taskSequence: string;
  priority: string;
  status: string;
  assignee: string;
}

/** model/response/TaskListResponse.java */
export interface TaskListItem extends Subtask {
  /** The assignee's user id; empty when nobody is assigned */
  assignee: string;
  assigneeName: string | null;
  /** null when nobody is assigned */
  assigneeEmail: string | null;
  /** yyyy-mm-dd */
  dueDate: string | null;
  /** ISO date */
  createdOn: string | null;
  /** ISO date; null until the task is changed for the first time */
  updatedOn: string | null;
  subtask: boolean;
  /** Sequence of the parent task; null on parent tasks */
  parentTaskId: string | null;
  subtaskCount: number;
  /** 1, 2, 3, 5, 8 or 13; null when not estimated */
  storyPoints: number | null;
  /** yyyy-mm-dd */
  startDate: string | null;
  /** In the order they were added */
  labels: string[];
}

/** model/response/TaskDetails.java – java.util.Date is sent as an ISO date */
export interface TaskDetails extends Subtask {
  subtask: boolean;
  /** Sequence of the parent task; null on parent tasks */
  parentTaskId: string | null;
  taskDesc: string;
  /** The assignee's email; null when nobody is assigned (assignee is then "NA") */
  assigneeEmail: string | null;
  createdOn: string;
  updatedOn: string;
  /** yyyy-mm-dd */
  dueDate: string | null;
  /** Only set on bugs */
  stepsToReproduce: string | null;
  expectedResult: string | null;
  actualResult: string | null;
  /** MINOR, MAJOR or CRITICAL; null when not set */
  severity: string | null;
  /** 1, 2, 3, 5, 8 or 13; null when not estimated */
  storyPoints: number | null;
  /** yyyy-mm-dd */
  startDate: string | null;
  /** In the order they were added */
  labels: string[];
}

/** model/response/StatisticsResponse.java */
export interface TaskStatistics {
  completed: number;
  inprogress: number;
  pending: number;
}

/** model/request/ProjectTaskRequest.java */
export interface ProjectTaskRequest {
  projectIdentifier: string;
  taskName: string;
  sprintId: string;
  priority: string;
  status: string;
  /** yyyy-mm-dd, optional */
  dueDate?: string;
  /** Optional, up to MAX_DESCRIPTION characters */
  description?: string;
  /** Email of the person to assign, optional */
  assignee?: string;
  /** TASK or BUG; empty takes the project's default */
  taskType?: string;
  /** The rest is only kept on a bug */
  stepsToReproduce?: string;
  expectedResult?: string;
  actualResult?: string;
  severity?: string;
  /** 1, 2, 3, 5, 8 or 13, optional */
  storyPoints?: number | null;
  /** yyyy-mm-dd, optional, not after the due date */
  startDate?: string;
  /** Up to MAX_LABELS */
  labels?: string[];
}

/** model/request/UpdateBugDetailsRequest.java – empty texts and an empty severity clear them */
export interface UpdateBugDetailsRequest {
  taskId: string;
  stepsToReproduce: string;
  expectedResult: string;
  actualResult: string;
  severity: string;
}

/** model/request/RequestCreateSubtask.java */
export interface CreateSubtaskRequest {
  projectId: string;
  parentTaskId: string;
  taskName: string;
  priority: string;
  status: string;
  /** yyyy-mm-dd, optional */
  dueDate?: string;
}

/** model/request/UpdateDueDateRequest.java */
export interface UpdateDueDateRequest {
  taskId: string;
  /** yyyy-mm-dd, empty removes the due date */
  dueDate: string;
}

/** model/response/AttachmentResponse.java */
export interface Attachment {
  attachmentId: string;
  fileName: string;
  contentType: string;
  /** Bytes */
  size: number;
  uploadedByName: string | null;
  /** ISO date */
  createdOn: string;
  /** The uploader and the project lead may delete it */
  canDelete: boolean;
}

/** The data of a createTask response */
export interface CreatedTask {
  taskSequence: string;
}

/** model/request/UpdateAssigneeRequest.java */
export interface UpdateAssigneeRequest {
  taskId: string;
  /** Email of the person to assign; empty unassigns the task */
  assignee: string;
}

/** model/request/UpdateStartDateRequest.java */
export interface UpdateStartDateRequest {
  taskId: string;
  /** yyyy-mm-dd, empty removes the start date */
  startDate: string;
}

/** model/request/UpdateEstimateRequest.java */
export interface UpdateEstimateRequest {
  taskId: string;
  /** null removes the estimate */
  storyPoints: number | null;
}

/** model/request/UpdateLabelsRequest.java */
export interface UpdateLabelsRequest {
  taskId: string;
  /** All of the task's labels after the change */
  labels: string[];
}

/** model/request/UpdateProjectTaskRequest.java */
export interface UpdateTaskRequest {
  taskId: string;
  status: string;
  assignee: string;
  priority: string;
  description: string;
}

export interface TaskState {
  /** The task open in the details panel; null when it's closed */
  selectedTaskSequence: string | null;
}
