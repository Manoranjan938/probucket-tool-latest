import type { ActivityType } from "features/activity/types";

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;

const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** The heading of the day an ISO date falls on, in the user's own timezone: "Today", "Yesterday" or e.g. "31 Oct" */
export const formatDay = (value: string) => {
  const date = new Date(value);
  const now = new Date();

  if (isSameDay(date, now)) {
    return "Today";
  }
  if (isSameDay(date, new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))) {
    return "Yesterday";
  }
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
};

/** Under today's heading how long ago it was, e.g. "2 hours ago". The heading already gives older entries their date. */
export const formatEntryTime = (value: string) => {
  const date = new Date(value);

  if (!isSameDay(date, new Date())) {
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  const elapsed = Date.now() - date.getTime();
  if (elapsed < MINUTE_MS) {
    return "just now";
  }
  if (elapsed < HOUR_MS) {
    return relativeTime.format(-Math.floor(elapsed / MINUTE_MS), "minute");
  }
  return relativeTime.format(-Math.floor(elapsed / HOUR_MS), "hour");
};

/* Filters on the Activity page */

export type ActivityKind =
  | "created"
  | "status"
  | "assignee"
  | "dates"
  | "comments"
  | "details"
  | "labels"
  | "attachments"
  | "members";

// Every recorded type belongs to one kind; a new type won't compile until it is given one
const kindOfType: Record<ActivityType, ActivityKind> = {
  TASK_CREATED: "created",
  SUBTASK_CREATED: "created",
  STATUS_CHANGED: "status",
  ASSIGNEE_CHANGED: "assignee",
  DUE_DATE_CHANGED: "dates",
  START_DATE_CHANGED: "dates",
  COMMENT_ADDED: "comments",
  PRIORITY_CHANGED: "details",
  DESCRIPTION_CHANGED: "details",
  SEVERITY_CHANGED: "details",
  BUG_DETAILS_CHANGED: "details",
  ESTIMATE_CHANGED: "details",
  LABEL_ADDED: "labels",
  LABEL_REMOVED: "labels",
  ATTACHMENT_ADDED: "attachments",
  ATTACHMENT_REMOVED: "attachments",
  MEMBER_ADDED: "members",
};

export const activityKinds: { id: ActivityKind; label: string; hint: string; teamOnly?: boolean }[] = [
  { id: "created", label: "Tasks created", hint: "Tasks and subtasks" },
  { id: "status", label: "Status", hint: "Moved to another column" },
  { id: "assignee", label: "Assignee", hint: "Assigned, reassigned, unassigned" },
  { id: "dates", label: "Dates", hint: "Due and start dates" },
  { id: "comments", label: "Comments", hint: "New comments" },
  { id: "details", label: "Details", hint: "Priority, description, severity, bug details, estimate" },
  { id: "labels", label: "Labels", hint: "Added or removed" },
  { id: "attachments", label: "Attachments", hint: "Added or removed" },
  { id: "members", label: "Team members", hint: "Added to the team", teamOnly: true },
];

/** The recorded types that make up the chosen kinds */
export const typesOfKinds = (kinds: ActivityKind[]) =>
  (Object.keys(kindOfType) as ActivityType[]).filter((type) => kinds.includes(kindOfType[type]));

export type DateRangePreset = "any" | "today" | "7d" | "30d" | "custom";

export const dateRangePresets: { id: DateRangePreset; label: string }[] = [
  { id: "any", label: "Any time" },
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "custom", label: "Custom range" },
];

/** yyyy-mm-dd of a date in the user's own timezone, as a date input shows it */
export const toDateInputValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

// Midnight at the start of a yyyy-mm-dd day, in the user's own timezone
const startOfDay = (value: string, addDays = 0) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day + addDays);
};

/**
 * The instants a date range covers, from inclusive and to exclusive, measured in the user's own timezone.
 * The last days include today. Custom dates are yyyy-mm-dd and both optional; to includes its whole day.
 */
export const dateRangeBounds = (
  preset: DateRangePreset,
  customFrom: string,
  customTo: string,
): { from?: string; to?: string } => {
  const today = toDateInputValue(new Date());

  switch (preset) {
    case "today":
      return { from: startOfDay(today).toISOString() };
    case "7d":
      return { from: startOfDay(today, -6).toISOString() };
    case "30d":
      return { from: startOfDay(today, -29).toISOString() };
    case "custom":
      return {
        from: customFrom ? startOfDay(customFrom).toISOString() : undefined,
        to: customTo ? startOfDay(customTo, 1).toISOString() : undefined,
      };
    default:
      return {};
  }
};

export interface ActivityFilterState {
  /** null is everyone */
  actorId: string | null;
  /** None is every kind */
  kinds: ActivityKind[];
  preset: DateRangePreset;
  /** yyyy-mm-dd or empty, used when preset is "custom" */
  customFrom: string;
  customTo: string;
}

export const noActivityFilters: ActivityFilterState = {
  actorId: null,
  kinds: [],
  preset: "any",
  customFrom: "",
  customTo: "",
};

export const hasActivityFilters = (filters: ActivityFilterState) =>
  filters.actorId !== null || filters.kinds.length > 0 || filters.preset !== "any";

/** True when the custom range ends before it starts */
export const isCustomRangeReversed = ({ preset, customFrom, customTo }: ActivityFilterState) =>
  preset === "custom" && !!customFrom && !!customTo && customTo < customFrom;

/** A date shown on a filter button, e.g. "31 Oct" */
export const formatFilterDate = (value: string) => {
  const date = startOfDay(value);
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
};
