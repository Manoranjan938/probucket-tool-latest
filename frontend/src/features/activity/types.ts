/** entity/ActivityType.java */
export type ActivityType =
  | "TASK_CREATED"
  | "SUBTASK_CREATED"
  | "STATUS_CHANGED"
  | "PRIORITY_CHANGED"
  | "ASSIGNEE_CHANGED"
  | "DUE_DATE_CHANGED"
  | "DESCRIPTION_CHANGED"
  | "COMMENT_ADDED"
  | "SEVERITY_CHANGED"
  | "BUG_DETAILS_CHANGED"
  | "MEMBER_ADDED";

/** model/response/ActivityResponse.java */
export interface Activity {
  id: number;
  type: ActivityType;
  actorName: string | null;
  /** null when the change isn't about a task, e.g. a member being added */
  taskSequence: string | null;
  taskName: string | null;
  oldValue: string | null;
  newValue: string | null;
  /** ISO date */
  createdOn: string;
}
