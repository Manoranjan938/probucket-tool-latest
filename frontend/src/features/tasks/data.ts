import type { OptionsObject } from "notistack";

// Labels and colours of task statuses and priorities (colours are theme tokens in index.css)

export interface StatusStyle {
  label: string;
  /** Text colour */
  text: string;
  /** Soft background */
  soft: string;
  /** Solid colour, for dots and bars */
  solid: string;
}

/** Keyed by the status the backend sends */
export const taskStatuses: Record<string, StatusStyle> = {
  TODO: { label: "To do", text: "text-status-todo", soft: "bg-status-todo-soft", solid: "bg-status-todo" },
  INPROGRESS: {
    label: "In progress",
    text: "text-status-progress",
    soft: "bg-status-progress-soft",
    solid: "bg-status-progress",
  },
  COMPLETED: { label: "Completed", text: "text-status-done", soft: "bg-status-done-soft", solid: "bg-status-done" },
};

/** Text colour of the priority flag, keyed by the priority the backend sends */
export const priorityColors: Record<string, string> = {
  HIGH: "text-priority-high",
  MEDIUM: "text-priority-medium",
  LOW: "text-priority-low",
};

/** Priorities the task dialogs offer, lowest first */
export const priorities = ["LOW", "MEDIUM", "HIGH"];

/** Older tasks have "Task" or no type, so only BUG is told apart */
export const isBug = (taskType: string | null | undefined) => taskType === "BUG";

/** The types a project takes, from the template it was created with; the first is the default */
export const taskTypesFor = (template: string | undefined) =>
  template === "bug" ? ["BUG"] : template === "project and bug" ? ["TASK", "BUG"] : ["TASK"];

/** Bug severities, least severe first */
export const severities = ["MINOR", "MAJOR", "CRITICAL"];

/** Text colour of a severity, matching the priority flags */
export const severityColors: Record<string, string> = {
  CRITICAL: "text-priority-high",
  MAJOR: "text-priority-medium",
  MINOR: "text-priority-low",
};

/** "LOW" -> "Low" */
export const formatEnum = (value: string | undefined) =>
  value ? value.charAt(0) + value.slice(1).toLowerCase() : "";

/** Epoch milliseconds, or a "yyyy-mm-dd hh:mm:ss" string from the backend, as e.g. "5 Jan 2026" */
export const formatDate = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  const date = new Date(typeof value === "string" ? value.replace(" ", "T") : value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

/** How many days ahead a task counts as due soon */
export const DUE_SOON_DAYS = 7;

/** The range the backend accepts (ProjectTaskService.parseDueDate) */
// Same limit as ProjectTaskRequest.MAX_DESCRIPTION in the backend
export const MAX_DESCRIPTION = 10000;

export const MIN_DUE_DATE = "2000-01-01";
export const MAX_DUE_DATE = "2100-12-31";

export type DueState = "overdue" | "today" | "soon" | "later";

/** Colours of the due date badge */
export const dueStyles: Record<DueState, string> = {
  overdue: "bg-due-overdue-soft text-due-overdue",
  today: "bg-due-soon-soft text-due-soon",
  soon: "bg-due-soon-soft text-due-soon",
  later: "bg-status-todo-soft text-brand-text",
};

/** A date in the user's own timezone as yyyy-mm-dd, which sorts and compares correctly as text */
const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/** A due date has no time, so it is compared with the user's own today. A completed task is never overdue. */
export const getDueState = (dueDate: string, status?: string): DueState => {
  if (status === "COMPLETED") {
    return "later";
  }
  const now = new Date();
  const today = toIsoDate(now);
  const lastSoonDay = toIsoDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + DUE_SOON_DAYS));

  if (dueDate < today) {
    return "overdue";
  }
  if (dueDate === today) {
    return "today";
  }
  return dueDate <= lastSoonDay ? "soon" : "later";
};

/** "2026-11-05" as e.g. "5 Nov", with the year if it isn't this year. new Date("2026-11-05") would read it as UTC. */
export const formatDueDate = (dueDate: string) => {
  const [year, month, day] = dueDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: year === new Date().getFullYear() ? undefined : "numeric",
  });
};

/** Toasts in the same corner as the Snackbars on the other pages */
export const toastOptions: OptionsObject = { anchorOrigin: { vertical: "bottom", horizontal: "right" } };
