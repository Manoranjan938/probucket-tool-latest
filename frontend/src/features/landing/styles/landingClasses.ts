// Shared Tailwind classes for the landing page sections

export const page =
  "bg-brand-surface text-brand-text leading-[1.6] [&_*]:box-border [&_*::before]:box-border [&_*::after]:box-border";

export const container = "w-full max-w-[1160px] mx-auto px-6";

export const section = "py-24 scroll-mt-[72px] max-[768px]:py-16";
export const sectionAlt = `${section} bg-brand-surface-alt`;

const sectionHeaderBase = "max-w-[720px] mx-auto text-center";
export const sectionHeader = `${sectionHeaderBase} mb-14 max-[768px]:mb-10`;
// "Coming soon" keeps a 36px gap on every screen size
export const sectionHeaderSoon = `${sectionHeaderBase} mb-9`;
export const sectionTitle =
  "mb-3 text-[36px] font-bold leading-[1.2] tracking-[-0.02em] text-brand-ink max-[768px]:text-[28px]";
export const sectionText = "text-[18px] max-[768px]:text-[16px]";

export const eyebrow = "inline-block mb-3 text-[13px] font-bold tracking-[0.08em] uppercase text-brand-strong";

export const brand = "flex items-center gap-2 no-underline text-brand-ink";
export const brandName = "font-bold tracking-[-0.01em]";

/* Buttons */
const btn =
  "inline-flex items-center justify-center gap-2 border rounded-[10px] font-semibold leading-[1.2] no-underline whitespace-nowrap cursor-pointer transition-[background-color,border-color,color,transform] duration-150 ease-[ease] focus-visible:outline-3 focus-visible:outline-offset-2 motion-reduce:transition-none";
const btnSize = "py-3 px-[22px] text-[16px]";
const btnPrimaryColors =
  "border-transparent bg-brand-strong text-white hover:bg-[#4f49b8] hover:text-white hover:[transform:translateY(-1px)] motion-reduce:hover:[transform:none] focus-visible:outline-brand-primary";

export const btnPrimary = `${btn} ${btnSize} ${btnPrimaryColors}`;
export const btnPrimarySmall = `${btn} py-[9px] px-4 text-[15px] ${btnPrimaryColors}`;
export const btnGhost = `${btn} ${btnSize} border-brand-border bg-brand-surface text-brand-ink hover:border-brand-primary hover:text-brand-strong focus-visible:outline-brand-primary`;
export const btnCta = `${btn} ${btnSize} border-transparent bg-white text-brand-strong hover:bg-brand-soft hover:text-brand-strong hover:[transform:translateY(-1px)] focus-visible:outline-white`;
