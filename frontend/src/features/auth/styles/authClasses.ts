// Shared Tailwind classes for the auth pages (Login, Signup, Forgot,
// ResetPassword, Logout, EmailVerify). Uses the same palette as the landing page.

const base =
  "grid min-h-screen text-brand-text leading-[1.5] [&_*]:box-border [&_*::before]:box-border [&_*::after]:box-border";

/* Form column + brand panel */
export const layout = `${base} grid-cols-[minmax(0,1fr)_minmax(0,1fr)] bg-brand-surface max-[900px]:grid-cols-[minmax(0,1fr)]`;

/* Single-column layout with the form in a card (no brand panel) */
export const layoutSingle = `${base} grid-cols-[minmax(0,1fr)] [background:radial-gradient(ellipse_80%_60%_at_50%_0%,var(--color-brand-soft)_0%,rgba(241,240,252,0)_70%),var(--color-brand-surface)]`;

export const main = "flex flex-col px-12 py-8 max-[480px]:px-4 max-[480px]:py-6";

export const brand = "inline-flex self-start items-center gap-2 no-underline text-brand-ink";
export const brandLogo = "w-[34px] h-[34px]";
export const brandName = "text-[22px] font-bold tracking-[-0.01em]";

const contentBase = "w-full m-auto py-12 max-[480px]:py-8";
export const content = `${contentBase} max-w-[400px]`;
export const contentSingle = `${contentBase} max-w-[440px]`;

export const title =
  "mb-2 text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-brand-ink max-[480px]:text-[28px]";
export const subtitle = "mb-8 text-[16px]";

export const field = "[&+&]:mt-5";
export const labelRow = "flex items-baseline justify-between mb-1.5";
export const label = "text-[14px] font-semibold text-brand-ink";
export const link = "text-[14px] font-semibold text-brand-strong no-underline hover:underline";

export const inputWrap = "relative";
export const input =
  "w-full h-[46px] px-3.5 py-0 border border-brand-border rounded-[10px] bg-brand-surface [font-family:inherit] text-[15px] text-brand-ink transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-brand-muted focus:outline-none focus:border-brand-primary focus:shadow-[0_0_0_3px_var(--color-brand-soft)] aria-invalid:border-brand-danger aria-invalid:focus:shadow-[0_0_0_3px_rgba(217,58,58,0.12)] motion-reduce:transition-none";
export const inputPassword = `${input} pr-12`;

export const toggle =
  "absolute top-1/2 right-1.5 flex items-center justify-center w-9 h-9 border-none rounded-lg bg-transparent text-[16px] text-brand-muted cursor-pointer -translate-y-1/2 hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-brand-primary";

export const error = "mt-1.5 text-[13px] font-medium text-brand-danger";

/* Buttons – same shape as the landing page buttons */
const btn =
  "flex items-center justify-center gap-2.5 w-full h-[46px] border rounded-[10px] [font-family:inherit] text-[16px] font-semibold no-underline cursor-pointer transition-[background-color,border-color,color] duration-150 ease-[ease] focus-visible:outline-3 focus-visible:outline-brand-primary focus-visible:outline-offset-2 motion-reduce:transition-none";
export const btnPrimary = `${btn} mt-7 border-transparent bg-brand-strong text-white hover:bg-[#4f49b8]`;
export const btnGoogle = `${btn} border-brand-border bg-brand-surface text-brand-ink hover:border-brand-primary hover:bg-brand-soft`;
export const btnGoogleLogo = "w-[22px] h-[22px]";
export const btnGhost = `${btn} mt-3 border-brand-border bg-brand-surface text-brand-ink hover:border-brand-primary hover:text-brand-strong`;

export const divider =
  "flex items-center gap-3 my-6 text-[13px] font-medium text-brand-muted before:content-[''] before:flex-1 before:h-px before:bg-brand-border after:content-[''] after:flex-1 after:h-px after:bg-brand-border";

export const footer = "mt-8 text-center";

export const card =
  "p-10 border border-brand-border rounded-2xl bg-brand-surface shadow-brand max-[480px]:px-5 max-[480px]:py-7";

/* Large round icon at the top of a status card */
export const statusIcon =
  "flex items-center justify-center w-[72px] h-[72px] mx-auto mb-6 rounded-[50%] bg-brand-soft text-[30px] text-brand-strong";

/* Signed-in user summary */
export const user = "flex items-center gap-3.5 p-4 border border-brand-border rounded-xl bg-brand-surface-alt";
export const avatar =
  "flex shrink-0 items-center justify-center w-12 h-12 rounded-[50%] bg-brand-strong text-[20px] font-bold text-white";
export const userInfo = "min-w-0";
export const userName = "truncate text-[16px] font-semibold text-brand-ink";
export const userEmail = "truncate text-[14px]";

/* Brand panel with two soft decorative circles */
export const panel =
  "relative flex items-center overflow-hidden p-16 bg-[linear-gradient(150deg,var(--color-brand-strong)_0%,var(--color-brand-primary)_100%)] text-[rgba(255,255,255,0.85)] before:content-[''] before:absolute before:rounded-[50%] before:bg-[rgba(255,255,255,0.08)] before:top-[-120px] before:right-[-120px] before:w-[360px] before:h-[360px] after:content-[''] after:absolute after:rounded-[50%] after:bg-[rgba(255,255,255,0.08)] after:bottom-[-160px] after:left-[-100px] after:w-[420px] after:h-[420px] max-[900px]:hidden";
export const panelInner = "relative z-1 max-w-[460px]";
export const panelEyebrow =
  "inline-block mb-3 text-[13px] font-bold tracking-[0.08em] uppercase text-[rgba(255,255,255,0.75)]";
export const panelTitle = "mb-4 text-[40px] font-extrabold leading-[1.1] tracking-[-0.03em] text-white";
export const panelText = "text-[17px]";
export const panelList = "mt-10 p-0 list-none";
export const panelItem = "flex gap-4 not-first:mt-6";
export const panelIcon =
  "flex shrink-0 items-center justify-center w-11 h-11 rounded-xl bg-[rgba(255,255,255,0.15)] text-[18px] font-bold text-white";
export const panelItemTitle = "mb-0.5 text-[16px] font-bold text-white";
export const panelItemText = "text-[15px]";
