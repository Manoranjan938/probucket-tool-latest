// Shared Tailwind classes for the Projects list and the Create project wizard.
// Uses the same palette as the landing and auth pages.

export const page =
  "min-h-screen bg-brand-surface-alt text-brand-text leading-[1.5] [&_*]:box-border [&_*::before]:box-border [&_*::after]:box-border";

export const container = "w-full max-w-[1160px] mx-auto px-6 py-10 max-[480px]:px-4 max-[480px]:py-8";
export const wizardContainer = "w-full max-w-[880px] mx-auto px-6 py-10 max-[480px]:px-4 max-[480px]:py-8";

/* Top bar */
export const topBar = "sticky top-0 z-10 border-b border-brand-border bg-brand-surface";
export const topBarInner = "flex items-center justify-between gap-4 h-16 max-w-[1160px] mx-auto px-6 max-[480px]:px-4";
export const brand = "flex items-center gap-2 no-underline text-brand-ink";
export const brandLogo = "w-[30px] h-[30px]";
export const brandName = "text-[20px] font-bold tracking-[-0.01em]";
export const user = "flex items-center gap-3 min-w-0";
export const avatar =
  "flex shrink-0 items-center justify-center w-9 h-9 rounded-[50%] bg-brand-strong text-[15px] font-bold text-white uppercase";
export const userName = "truncate text-[15px] font-semibold text-brand-ink max-[640px]:hidden";
export const logout =
  "inline-flex shrink-0 items-center gap-2 h-9 px-3 border border-brand-border rounded-lg text-[14px] font-semibold text-brand-ink no-underline transition-[border-color,color] duration-150 ease-[ease] hover:border-brand-primary hover:text-brand-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-primary motion-reduce:transition-none";

/* Page heading */
export const header = "flex items-end justify-between gap-4 mb-8 max-[560px]:flex-col max-[560px]:items-stretch";
// The wizard keeps Cancel next to the title on small screens too
export const wizardHeader = "flex items-start justify-between gap-4 mb-8";
export const title =
  "mb-1.5 text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-brand-ink max-[480px]:text-[24px]";
export const subtitle = "text-[16px]";

/* Buttons – same shape as the landing page buttons */
const btn =
  "inline-flex items-center justify-center gap-2 h-11 px-5 border rounded-[10px] [font-family:inherit] text-[15px] font-semibold leading-[1.2] no-underline whitespace-nowrap cursor-pointer transition-[background-color,border-color,color] duration-150 ease-[ease] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none";
export const btnPrimary = `${btn} border-transparent bg-brand-strong text-white hover:bg-[#4f49b8] hover:text-white disabled:hover:bg-brand-strong`;
export const btnGhost = `${btn} border-brand-border bg-brand-surface text-brand-ink hover:border-brand-primary hover:text-brand-strong`;
export const linkButton =
  "p-0 border-none bg-transparent [font-family:inherit] text-[14px] font-semibold text-brand-strong cursor-pointer hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

/* Project cards */
export const grid =
  "grid grid-cols-[repeat(3,minmax(0,1fr))] gap-5 m-0 p-0 list-none max-[960px]:grid-cols-[repeat(2,minmax(0,1fr))] max-[640px]:grid-cols-[minmax(0,1fr)]";
export const card =
  "group flex flex-col gap-5 h-full p-6 border border-brand-border rounded-brand bg-brand-surface no-underline transition-[border-color,box-shadow] duration-150 ease-[ease] hover:border-[#d4d2f2] hover:shadow-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-primary motion-reduce:transition-none";
export const cardAvatar =
  "flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-brand-soft text-[20px] font-bold text-brand-strong uppercase";
export const cardName = "mb-1 truncate text-[17px] font-bold text-brand-ink capitalize";
export const badge =
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-soft text-[12px] font-semibold text-brand-strong capitalize";
export const cardFooter = "flex items-center justify-between gap-3 mt-auto pt-4 border-t border-brand-border text-[14px]";
export const cardLead = "min-w-0 truncate";
export const cardLeadName = "font-semibold text-brand-ink";
export const cardArrow =
  "shrink-0 text-[14px] text-brand-muted transition-[color,transform] duration-150 ease-[ease] group-hover:translate-x-0.5 group-hover:text-brand-strong motion-reduce:transition-none";

/* No projects */
export const empty =
  "max-w-[480px] mx-auto mt-[8vh] p-10 border border-brand-border rounded-2xl bg-brand-surface text-center shadow-brand max-[480px]:px-5 max-[480px]:py-8";
export const emptyIcon =
  "flex items-center justify-center w-[72px] h-[72px] mx-auto mb-6 rounded-[50%] bg-brand-soft text-[28px] text-brand-strong";
export const emptyTitle = "mb-2 text-[24px] font-bold leading-[1.2] tracking-[-0.02em] text-brand-ink";
export const emptyText = "text-[16px] not-last:mb-7";

/* Wizard stepper */
export const stepper = "flex items-center gap-3 mb-6 p-0 list-none";
export const stepItem = "flex items-center gap-3 flex-1 last:flex-none";
export const step = "flex shrink-0 items-center gap-2.5 p-0 border-none bg-transparent [font-family:inherit] text-left";
export const stepButton = `${step} cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary [&:hover>span:last-child]:text-brand-strong`;
const stepDot = "flex shrink-0 items-center justify-center w-8 h-8 border-2 rounded-[50%] text-[14px] font-bold";
export const stepDotUpcoming = `${stepDot} border-brand-border bg-brand-surface text-brand-muted`;
export const stepDotActive = `${stepDot} border-brand-strong bg-brand-surface text-brand-strong shadow-[0_0_0_4px_var(--color-brand-soft)]`;
export const stepDotDone = `${stepDot} border-brand-strong bg-brand-strong text-[12px] text-white`;
export const stepLabel = "text-[15px] font-semibold text-brand-ink max-[560px]:hidden";
export const stepLabelActive = "text-[15px] font-semibold text-brand-ink";
export const stepLabelUpcoming = "text-[15px] font-semibold text-brand-muted max-[560px]:hidden";
const stepLine = "flex-1 h-0.5 min-w-4 rounded-full";
export const stepLineDone = `${stepLine} bg-brand-strong`;
export const stepLineUpcoming = `${stepLine} bg-brand-border`;

/* Wizard card */
export const wizardCard =
  "p-8 border border-brand-border rounded-2xl bg-brand-surface shadow-brand max-[560px]:px-5 max-[560px]:py-6";
export const stepTitle = "mb-1 text-[20px] font-bold leading-[1.3] text-brand-ink";
export const stepText = "mb-6 text-[15px]";
export const wizardActions = "flex items-center justify-between gap-3 mt-8 pt-6 border-t border-brand-border";

/* Template / type option cards (a radio button inside a label) */
export const optionGrid =
  "grid grid-cols-[repeat(3,minmax(0,1fr))] gap-4 max-[768px]:grid-cols-[minmax(0,1fr)]";
export const option =
  "relative flex flex-col p-5 border border-brand-border rounded-xl bg-brand-surface cursor-pointer transition-[border-color,background-color,box-shadow] duration-150 ease-[ease] hover:border-brand-primary has-checked:border-brand-strong has-checked:bg-brand-soft has-checked:shadow-[inset_0_0_0_1px_var(--color-brand-strong)] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-primary has-disabled:cursor-not-allowed has-disabled:border-dashed has-disabled:border-[#c9c6ec] has-disabled:bg-brand-surface-alt motion-reduce:transition-none";
export const optionCheck =
  "absolute top-4 right-4 flex items-center justify-center w-5 h-5 border border-brand-border rounded-[50%] bg-brand-surface text-[10px] text-transparent peer-checked:border-brand-strong peer-checked:bg-brand-strong peer-checked:text-white peer-disabled:hidden";
export const optionIcon =
  "flex items-center justify-center w-11 h-11 mb-4 rounded-[10px] bg-brand-soft text-[20px] text-brand-strong peer-checked:bg-brand-surface peer-disabled:opacity-60";
export const optionTitle = "flex flex-wrap items-center gap-2 mb-1.5 text-[16px] font-bold text-brand-ink";
export const optionBadge =
  "inline-flex px-2 py-0.5 rounded-full bg-brand-border text-[11px] font-bold tracking-[0.04em] uppercase text-brand-text";
export const optionText = "text-[14px]";

/* Project details step */
export const detailsGrid = "grid grid-cols-[minmax(0,1fr)_280px] gap-8 max-[768px]:grid-cols-[minmax(0,1fr)]";
export const field = "[&+&]:mt-5";
export const label = "block mb-1.5 text-[14px] font-semibold text-brand-ink";
export const labelHint = "font-normal text-brand-muted";
const inputBase =
  "w-full px-3.5 border border-brand-border rounded-[10px] bg-brand-surface [font-family:inherit] text-[15px] text-brand-ink transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-brand-muted focus:outline-none focus:border-brand-primary focus:shadow-[0_0_0_3px_var(--color-brand-soft)] aria-invalid:border-brand-danger aria-invalid:focus:shadow-[0_0_0_3px_rgba(217,58,58,0.12)] motion-reduce:transition-none";
export const input = `${inputBase} h-[46px] py-0`;
export const textarea = `${inputBase} min-h-[120px] py-3 leading-[1.5] resize-y`;
export const error = "mt-1.5 text-[13px] font-medium text-brand-danger";

export const summary = "self-start p-5 border border-brand-border rounded-xl bg-brand-surface-alt";
export const summaryTitle = "mb-4 text-[13px] font-bold tracking-[0.08em] uppercase text-brand-muted";
export const summaryRow = "flex items-center gap-3 [&+&]:mt-4 [&+&]:pt-4 [&+&]:border-t [&+&]:border-brand-border";
export const summaryIcon =
  "flex shrink-0 items-center justify-center w-9 h-9 rounded-lg bg-brand-soft text-[16px] text-brand-strong";
export const summaryLabel = "text-[13px] text-brand-muted";
export const summaryValue = "truncate text-[15px] font-semibold text-brand-ink";
