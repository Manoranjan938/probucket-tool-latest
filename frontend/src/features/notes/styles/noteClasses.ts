// Shared Tailwind classes for the Notes page and its dialogs.
// Uses the same palette and shapes as the Your work page (features/tasks/styles/taskClasses.ts).

const base =
  "text-brand-text leading-[1.5] [&_*]:box-border [&_*::before]:box-border [&_*::after]:box-border";

export const page = `${base} flex flex-col gap-5`;

/* Toolbar */
export const toolbar = "flex items-center justify-between gap-4 max-[640px]:gap-3";
export const search =
  "flex items-center gap-2 w-[280px] h-10 px-3 border border-brand-border rounded-[10px] bg-brand-surface text-brand-muted focus-within:border-brand-primary focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)] max-[640px]:flex-1 max-[640px]:w-auto max-[640px]:min-w-0";
export const searchInput =
  "flex-1 min-w-0 border-none bg-transparent outline-none [font-family:inherit] text-[14px] text-brand-ink placeholder:text-brand-muted";

/* Buttons */
const btn =
  "inline-flex shrink-0 items-center justify-center gap-2 h-10 px-4 border rounded-[10px] [font-family:inherit] text-[14px] font-semibold no-underline whitespace-nowrap cursor-pointer transition-[background-color,border-color,color] duration-150 ease-[ease] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none";
export const btnPrimary = `${btn} border-transparent bg-brand-strong text-white hover:bg-[#4f49b8] disabled:hover:bg-brand-strong`;
export const btnGhost = `${btn} border-brand-border bg-brand-surface text-brand-ink hover:border-brand-primary hover:text-brand-strong`;
export const iconButton =
  "flex shrink-0 items-center justify-center w-8 h-8 border-none rounded-lg bg-transparent text-[16px] text-brand-muted cursor-pointer transition-[background-color,color] duration-150 ease-[ease] hover:bg-brand-surface-alt hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-brand-primary motion-reduce:transition-none";

/* Note cards */
export const grid =
  "grid grid-cols-[repeat(3,minmax(0,1fr))] gap-4 m-0 p-0 list-none max-[1100px]:grid-cols-[repeat(2,minmax(0,1fr))] max-[640px]:grid-cols-[minmax(0,1fr)]";
export const card =
  "relative flex h-full border border-brand-border rounded-brand bg-brand-surface transition-[border-color,box-shadow] duration-150 ease-[ease] hover:border-[#d4d2f2] hover:shadow-brand has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-primary motion-reduce:transition-none";
// The card's text is a button that opens the note; the options button sits next to it
export const cardButton =
  "flex flex-col gap-2 flex-1 min-w-0 min-h-[150px] p-5 pr-12 border-none rounded-brand bg-transparent [font-family:inherit] text-left cursor-pointer outline-none";
export const cardTitle = "line-clamp-2 text-[16px] font-bold leading-[1.35] text-brand-ink break-words";
export const cardText = "line-clamp-4 text-[14px] text-brand-text whitespace-pre-line break-words";
export const cardTextEmpty = "text-[14px] italic text-brand-muted";
export const cardMenu = `${iconButton} absolute top-3.5 right-3`;

/* Empty state */
export const empty =
  "flex flex-col items-center max-w-[460px] mx-auto mt-[6vh] p-10 border border-brand-border rounded-2xl bg-brand-surface text-center shadow-brand max-[480px]:px-5 max-[480px]:py-8";
export const emptyIcon =
  "flex items-center justify-center w-16 h-16 mb-5 rounded-[50%] bg-brand-soft text-[26px] text-brand-strong";
export const emptyTitle = "mb-2 text-[20px] font-bold text-brand-ink";
export const emptyText = "mb-6 text-[15px]";

/* Dialogs (new note, read a note) */
export const dialogPaper = `${base} w-full max-w-[520px]! m-4! rounded-2xl! bg-brand-surface!`;
export const dialogHeader = "flex items-start justify-between gap-3 px-6 pt-5 pb-1";
export const dialogTitle = "text-[18px] font-bold leading-[1.35] text-brand-ink break-words";
export const dialogSubtitle = "text-[13px] text-brand-muted";
export const dialogBody = "px-6 pt-3 pb-2";
export const dialogFooter = "flex items-center justify-end gap-2 px-6 pt-4 pb-5";
export const noteText = "max-h-[60vh] overflow-y-auto text-[15px] leading-[1.6] text-brand-ink whitespace-pre-wrap break-words";

/* Form fields */
export const field = "flex flex-col gap-1.5 [&+&]:mt-4";
export const label = "text-[14px] font-semibold text-brand-ink";
export const labelHint = "font-normal text-brand-muted";
const inputBase =
  "w-full px-3.5 border border-brand-border rounded-[10px] bg-brand-surface [font-family:inherit] text-[15px] text-brand-ink transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-brand-muted focus:outline-none focus:border-brand-primary focus:shadow-[0_0_0_3px_var(--color-brand-soft)] aria-invalid:border-brand-danger motion-reduce:transition-none";
export const input = `${inputBase} h-11 py-0`;
export const textarea = `${inputBase} min-h-[140px] py-3 leading-[1.5] resize-y`;
export const error = "text-[13px] font-medium text-brand-danger";
