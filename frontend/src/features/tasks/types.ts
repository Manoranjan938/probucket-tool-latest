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
}

/** model/response/TaskDetails.java – java.util.Date is sent as an ISO date */
export interface TaskDetails extends Subtask {
  subtask: boolean;
  /** Sequence of the parent task; null on parent tasks */
  parentTaskId: string | null;
  taskDesc: string;
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
