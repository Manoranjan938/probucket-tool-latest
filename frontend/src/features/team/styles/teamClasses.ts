// Shared Tailwind classes for the Team members page and its dialogs.
// Uses the same palette and shapes as the other dashboard pages.

const base =
  "text-brand-text leading-[1.5] [&_*]:box-border [&_*::before]:box-border [&_*::after]:box-border";

export const page = `${base} flex flex-col gap-5`;

/* Header */
export const header = "flex items-center justify-between gap-4";
export const count = "text-[15px]";

/* Buttons */
const btn =
  "inline-flex shrink-0 items-center justify-center gap-2 h-10 px-4 border rounded-[10px] [font-family:inherit] text-[14px] font-semibold no-underline whitespace-nowrap cursor-pointer transition-[background-color,border-color,color] duration-150 ease-[ease] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none";
export const btnPrimary = `${btn} border-transparent bg-brand-strong text-white hover:bg-[#4f49b8] disabled:hover:bg-brand-strong`;
export const btnGhost = `${btn} border-brand-border bg-brand-surface text-brand-ink hover:border-brand-primary hover:text-brand-strong`;
export const btnSmall = "h-8! px-3! text-[13px]!";
export const iconButton =
  "flex shrink-0 items-center justify-center w-8 h-8 border-none rounded-lg bg-transparent text-[16px] text-brand-muted cursor-pointer transition-[background-color,color] duration-150 ease-[ease] hover:bg-brand-surface-alt hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-brand-primary motion-reduce:transition-none";

/* Members table – each row becomes a card below 768px */
export const tableCard = "border border-brand-border rounded-brand bg-brand-surface overflow-hidden max-[768px]:border-none max-[768px]:bg-transparent max-[768px]:overflow-visible";
export const table = "w-full border-collapse max-[768px]:block";
export const thead = "bg-brand-surface-alt max-[768px]:hidden";
export const th = "px-5 py-3 text-left text-[12px] font-bold tracking-[0.06em] uppercase text-brand-muted";
export const tbody = "max-[768px]:flex max-[768px]:flex-col max-[768px]:gap-3";
export const tr =
  "border-t border-brand-border max-[768px]:grid max-[768px]:grid-cols-[minmax(0,1fr)_auto] max-[768px]:gap-x-3 max-[768px]:gap-y-2 max-[768px]:p-4 max-[768px]:border max-[768px]:rounded-brand max-[768px]:bg-brand-surface";
export const td = "px-5 py-3.5 text-[14px] align-middle max-[768px]:p-0";
// The cells that sit on the second line of a card on small screens
export const tdMeta = `${td} max-[768px]:col-span-2 max-[768px]:flex max-[768px]:items-center max-[768px]:gap-2 max-[768px]:text-[13px]`;
export const tdAction = `${td} w-[1%] text-right max-[768px]:col-start-2 max-[768px]:row-start-1`;
export const metaLabel = "hidden max-[768px]:inline text-brand-muted";

export const member = "flex items-center gap-3 min-w-0";
export const avatar =
  "flex shrink-0 items-center justify-center w-9 h-9 rounded-[50%] bg-brand-strong text-[14px] font-bold text-white uppercase";
export const avatarInactive = `${avatar} bg-brand-border! text-brand-text!`;
export const memberName = "truncate text-[15px] font-semibold text-brand-ink";
export const memberEmail = "truncate text-[13px] text-brand-muted";
export const role = "text-brand-ink";
export const roleEmpty = "text-brand-muted";
export const statusPill = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold whitespace-nowrap";
export const statusActive = `${statusPill} bg-status-done-soft text-status-done`;
export const statusInactive = `${statusPill} bg-status-todo-soft text-status-todo`;
export const statusDot = "w-1.5 h-1.5 rounded-[50%] bg-current";

/* Empty state */
export const empty =
  "flex flex-col items-center max-w-[460px] mx-auto mt-[6vh] p-10 border border-brand-border rounded-2xl bg-brand-surface text-center shadow-brand max-[480px]:px-5 max-[480px]:py-8";
export const emptyIcon =
  "flex items-center justify-center w-16 h-16 mb-5 rounded-[50%] bg-brand-soft text-[26px] text-brand-strong";
export const emptyTitle = "mb-2 text-[20px] font-bold text-brand-ink";
export const emptyText = "mb-6 text-[15px]";

/* Dialogs */
export const dialogPaper = `${base} w-full max-w-[460px]! m-4! rounded-2xl! bg-brand-surface!`;
export const dialogHeader = "flex items-start justify-between gap-3 px-6 pt-5 pb-1";
export const dialogTitle = "text-[18px] font-bold leading-[1.35] text-brand-ink";
export const dialogSubtitle = "text-[13px] text-brand-muted";
export const dialogBody = "px-6 pt-3 pb-2";
export const dialogFooter = "flex items-center justify-end gap-2 px-6 pt-4 pb-5";
export const successIcon =
  "flex items-center justify-center w-12 h-12 mb-3 rounded-[50%] bg-status-done-soft text-[22px] text-status-done";

/* Form fields */
export const field = "flex flex-col gap-1.5 [&+&]:mt-4";
export const label = "text-[14px] font-semibold text-brand-ink";
export const labelHint = "font-normal text-brand-muted";
export const input =
  "w-full h-11 px-3.5 py-0 border border-brand-border rounded-[10px] bg-brand-surface [font-family:inherit] text-[15px] text-brand-ink transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-brand-muted focus:outline-none focus:border-brand-primary focus:shadow-[0_0_0_3px_var(--color-brand-soft)] aria-invalid:border-brand-danger read-only:bg-brand-surface-alt motion-reduce:transition-none";
export const inputMono = `${input} font-mono! tracking-[0.04em]`;
export const inputRow = "flex items-center gap-2";
export const error = "text-[13px] font-medium text-brand-danger";
export const hint = "text-[13px] text-brand-muted";
export const notice =
  "flex gap-2.5 mt-4 p-3 border border-[#f3dfb4] rounded-[10px] bg-[#fff8ea] text-[13px] text-brand-ink";

/* Active / Inactive picker (radio buttons styled as a segmented control) */
export const segmented = "grid grid-cols-2 gap-1 p-1 rounded-[10px] bg-brand-surface-alt border border-brand-border";
export const segment =
  "flex items-center justify-center gap-1.5 h-9 rounded-lg text-[14px] font-semibold text-brand-text cursor-pointer has-checked:bg-brand-surface has-checked:text-brand-ink has-checked:shadow-[0_1px_2px_rgba(31,29,58,0.12)] has-focus-visible:outline-2 has-focus-visible:outline-brand-primary";
