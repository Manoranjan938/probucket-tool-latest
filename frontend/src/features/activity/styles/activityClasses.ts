/* A timeline of changes, grouped by day */
export const day = "[&+&]:mt-5";
export const dayLabel = "mb-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-muted";
export const list = "m-0 p-0 list-none";
// after: is the line joining this entry's icon to the next one
export const entry =
  "relative flex items-start gap-3 min-w-0 pb-5 last:pb-0 after:absolute after:top-9 after:bottom-1 after:left-[15px] after:w-0.5 after:rounded-full after:bg-brand-border last:after:hidden";
export const icon = "flex shrink-0 items-center justify-center w-8 h-8 rounded-[50%] text-[15px]";
export const body = "flex-1 min-w-0 pt-1";
export const sentence = "text-[14px] leading-[1.6] text-brand-text";
export const strong = "font-semibold text-brand-ink";
export const taskKey =
  "inline-block px-1.5 rounded-md border border-brand-border bg-brand-surface-alt text-[12px] font-semibold leading-[1.5] text-brand-ink whitespace-nowrap";
export const statusPill = "inline-block px-2 rounded-full text-[12px] font-semibold leading-[1.6] whitespace-nowrap";
export const meta = "flex items-center gap-1.5 min-w-0 mt-0.5 text-[13px] text-brand-muted";
export const detail = "truncate";
export const time = "shrink-0";

/* Colour of an entry's icon, by the kind of change */
export const toneBrand = "bg-brand-soft text-brand-strong";
export const toneNeutral = "bg-status-todo-soft text-status-todo";
export const toneDone = "bg-status-done-soft text-status-done";
export const toneProgress = "bg-status-progress-soft text-status-progress";
export const toneComment = "bg-activity-comment-soft text-activity-comment";
export const toneSoon = "bg-due-soon-soft text-due-soon";
export const toneOverdue = "bg-due-overdue-soft text-due-overdue";
