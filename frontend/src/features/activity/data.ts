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
