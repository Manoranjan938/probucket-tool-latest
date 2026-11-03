// Shared Tailwind classes for the Profile page: header, tabs and the account cards.
// Uses the same palette as the Projects pages (see features/projects/styles/projectClasses.ts).

const base =
  "text-brand-text leading-[1.5] [&_*]:box-border [&_*::before]:box-border [&_*::after]:box-border";

export const page = `${base} min-h-screen bg-brand-surface-alt`;
export const container = "w-full max-w-[880px] mx-auto px-6 py-8 max-[480px]:px-4 max-[480px]:py-6";
export const backLink =
  "inline-flex items-center gap-1.5 mb-4 text-[14px] font-semibold text-brand-text no-underline hover:text-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

/* Header */
export const header =
  "flex items-center gap-4 p-6 border border-brand-border rounded-brand bg-brand-surface max-[480px]:p-5";
export const headerAvatar =
  "flex shrink-0 items-center justify-center w-16 h-16 rounded-[50%] bg-brand-strong text-[26px] font-bold text-white uppercase";
export const headerText = "flex-1 min-w-0";
export const headerName =
  "truncate text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-brand-ink max-[480px]:text-[20px]";
export const headerEmail = "truncate text-[15px]";
export const roleBadge =
  "inline-flex shrink-0 items-center px-2.5 py-0.5 rounded-full bg-brand-soft text-[12px] font-semibold text-brand-strong whitespace-nowrap max-[560px]:hidden";

/* Tabs */
export const tabs = "flex items-center gap-1 w-fit my-5 p-1 rounded-[10px] bg-[#efeef6]";
export const tab =
  "h-9 px-4 border-none rounded-lg bg-transparent [font-family:inherit] text-[14px] font-semibold text-brand-text cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-primary";
export const tabActive = `${tab} bg-brand-surface! text-brand-ink! shadow-[0_1px_2px_rgba(31,29,58,0.12)]`;
export const panel = "flex flex-col gap-5";

/* Cards */
export const card = "border border-brand-border rounded-brand bg-brand-surface";
export const cardHeader = "flex items-start justify-between gap-3 px-6 pt-5 max-[480px]:px-4";
export const cardTitle = "text-[16px] font-bold text-brand-ink";
export const cardText = "text-[14px]";
export const cardBody = "px-6 pt-4 pb-6 max-[480px]:px-4";
export const comingSoonGrid =
  "grid grid-cols-[repeat(3,minmax(0,1fr))] gap-5 max-[768px]:grid-cols-[minmax(0,1fr)]";
export const comingSoonCard =
  "flex flex-col gap-2 px-6 py-5 border border-brand-border rounded-brand bg-brand-surface max-[480px]:px-4";
export const comingSoonIcon =
  "flex items-center justify-center w-9 h-9 rounded-[10px] bg-brand-surface-alt text-[17px] text-brand-muted";

/* Read-only details */
export const detailList = "m-0 px-6 pt-3 pb-2 max-[480px]:px-4";
export const detailRow =
  "grid grid-cols-[140px_minmax(0,1fr)] items-center gap-3 min-h-11 py-2 border-t border-brand-border first:border-t-0 text-[14px] max-[480px]:grid-cols-[minmax(0,1fr)] max-[480px]:gap-0.5";
export const detailLabel = "text-brand-muted";
export const detailValue = "flex items-center justify-between gap-3 min-w-0 m-0 font-semibold text-brand-ink";
export const detailText = "truncate";
export const detailEmpty = "font-normal text-brand-muted";

/* Photo */
export const photoRow = "flex items-center gap-4 flex-wrap";
export const photoAvatar =
  "flex shrink-0 items-center justify-center w-14 h-14 rounded-[50%] bg-brand-strong text-[22px] font-bold text-white uppercase";

/* Forms */
export const form = "max-w-[420px]";
export const field = "[&+&]:mt-4";
export const label = "block mb-1.5 text-[14px] font-semibold text-brand-ink";
export const inputWrap = "relative";
const inputBase =
  "w-full px-3.5 border border-brand-border rounded-[10px] bg-brand-surface [font-family:inherit] text-[15px] text-brand-ink transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-brand-muted disabled:cursor-not-allowed disabled:bg-brand-surface-alt focus:outline-none focus:border-brand-primary focus:shadow-[0_0_0_3px_var(--color-brand-soft)] aria-invalid:border-brand-danger aria-invalid:focus:shadow-[0_0_0_3px_rgba(217,58,58,0.12)] motion-reduce:transition-none";
export const input = `${inputBase} h-11 py-0`;
export const inputPassword = `${input} pr-12`;
export const textarea = `${inputBase} block min-h-[96px] py-3 leading-[1.5] resize-none`;
export const toggle =
  "absolute top-1/2 right-1.5 flex items-center justify-center w-8 h-8 border-none rounded-lg bg-transparent text-[16px] text-brand-muted cursor-pointer -translate-y-1/2 hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-brand-primary";
export const hint = "mt-1.5 text-[13px] text-brand-muted";
export const error = "mt-1.5 text-[13px] font-medium text-brand-danger";
export const formActions = "mt-5";

/* Buttons – same shape as the dashboard buttons */
const btn =
  "inline-flex shrink-0 items-center justify-center gap-2 h-10 px-4 border rounded-[10px] [font-family:inherit] text-[14px] font-semibold no-underline whitespace-nowrap cursor-pointer transition-[background-color,border-color,color] duration-150 ease-[ease] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none";
export const btnPrimary = `${btn} border-transparent bg-brand-strong text-white hover:bg-[#4f49b8] disabled:hover:bg-brand-strong`;
export const btnGhost = `${btn} border-brand-border bg-brand-surface text-brand-ink hover:border-brand-primary hover:text-brand-strong disabled:hover:border-brand-border disabled:hover:text-brand-ink`;

/* Dialog */
export const dialogPaper = `${base} w-full max-w-[460px]! m-4! rounded-2xl! bg-brand-surface!`;
export const dialogTitle = "px-6 pt-5 text-[18px] font-bold text-brand-ink";
export const dialogText = "px-6 pt-2 text-[15px]";
export const dialogFooter = "flex items-center justify-end gap-2 px-6 pt-5 pb-5";
