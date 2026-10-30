/** model/response/TaskListResponse.java */
export interface TaskListItem {
  taskName: string;
  taskType: string;
  taskSequence: string;
  priority: string;
  status: string;
  assignee: string;
}

/** model/response/SubtaskList.java */
export type Subtask = TaskListItem;

/** model/response/TaskDetails.java – java.util.Date is sent as epoch milliseconds */
export interface TaskDetails extends TaskListItem {
  taskDesc: string;
  createdOn: number;
  updatedOn: number;
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
}

/** model/request/RequestCreateSubtask.java */
export interface CreateSubtaskRequest {
  projectId: string;
  parentTaskId: string;
  taskName: string;
  priority: string;
  status: string;
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
  /** undefined until the task list is loaded */
  allTask: TaskListItem[] | undefined;
  /** Empty object until a task is selected */
  selectedTask: Partial<TaskDetails>;
  allSubtasks: Subtask[];
  selectedSubtask: Partial<Subtask>;
}
