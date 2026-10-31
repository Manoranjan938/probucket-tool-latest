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

/** Toasts in the same corner as the Snackbars on the other pages */
export const toastOptions: OptionsObject = { anchorOrigin: { vertical: "bottom", horizontal: "right" } };
