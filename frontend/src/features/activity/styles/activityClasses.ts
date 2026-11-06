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

/* The Activity page */
const base =
  "text-brand-text leading-[1.5] [&_*]:box-border [&_*::before]:box-border [&_*::after]:box-border";
export const page = `${base} flex flex-col gap-5 max-w-[880px]`;
export const intro = "text-[15px]";
export const pageCard = "p-6 border border-brand-border rounded-brand bg-brand-surface max-[640px]:p-5";
export const pageFooter = "flex flex-col items-center gap-2 mt-6 pt-5 border-t border-brand-border text-center";
export const endNote = "text-[14px] text-brand-muted";
export const errorText = "text-[14px] font-medium text-brand-danger";
export const emptyState = "flex flex-col items-center gap-3 py-10 text-center";
export const emptyTitle = "text-[16px] font-bold text-brand-ink";
export const emptyText = "text-[14px]";

/* Filter bar */
export const filters = "flex flex-col gap-3 mb-6 pb-5 border-b border-brand-border";
export const filterRow = "flex items-center gap-2 flex-wrap";
const filterButtonBase =
  "inline-flex items-center gap-1.5 max-w-full h-9 px-3 border rounded-full [font-family:inherit] text-[14px] font-semibold whitespace-nowrap cursor-pointer transition-[background-color,border-color,color] duration-150 ease-[ease] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary motion-reduce:transition-none";
export const filterButton = `${filterButtonBase} border-brand-border bg-brand-surface text-brand-ink hover:border-brand-primary`;
// A filter that is narrowing the list
export const filterButtonActive = `${filterButtonBase} border-brand-primary bg-brand-soft text-brand-strong`;
export const filterButtonLabel = "font-normal text-brand-muted";
export const filterButtonValue = "min-w-0 truncate";
export const filterChevron = "shrink-0 text-[15px]";
export const clearFilters =
  "h-9 px-2 border-none bg-transparent [font-family:inherit] text-[14px] font-semibold text-brand-strong cursor-pointer hover:underline focus-visible:outline-2 focus-visible:outline-brand-primary";
export const customRange = "flex items-end gap-3 flex-wrap";
export const dateField = "flex flex-col gap-1";
export const dateLabel = "text-[13px] font-semibold text-brand-ink";
export const dateInput =
  "h-9 px-3 border border-brand-border rounded-[10px] bg-brand-surface [font-family:inherit] text-[14px] text-brand-ink focus:outline-none focus:border-brand-primary focus:shadow-[0_0_0_3px_var(--color-brand-soft)] aria-invalid:border-brand-danger";

/* Filter menus (MUI renders them in a portal) */
export const menuPaper = "mt-1 min-w-[240px] max-w-[calc(100vw-32px)] border border-brand-border rounded-xl! shadow-brand!";
export const menuItem = "gap-3 min-h-10! px-4! [font-family:inherit]! text-[14px]! text-brand-ink! whitespace-normal!";
export const menuItemText = "flex flex-col flex-1 min-w-0";
export const menuItemLabel = "truncate font-semibold";
export const menuItemHint = "text-[12px] text-brand-muted";
export const menuCheck = "shrink-0 text-[15px] text-brand-strong";
export const menuCheckSlot = "shrink-0 w-[15px]";
export const checkbox =
  "flex shrink-0 items-center justify-center w-[18px] h-[18px] rounded-[5px] border border-brand-border bg-brand-surface text-[12px] text-transparent";
export const checkboxOn = `${checkbox} border-brand-strong! bg-brand-strong! text-white!`;
export const personAvatar =
  "flex shrink-0 items-center justify-center w-7 h-7 rounded-[50%] bg-brand-soft text-[12px] font-semibold uppercase text-brand-strong";

/* Dashboard card: the entries scroll inside it */
export const cardScroll =
  "max-h-[420px] overflow-y-auto -mr-3 pr-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";
