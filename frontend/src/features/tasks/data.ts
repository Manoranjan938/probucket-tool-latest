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
