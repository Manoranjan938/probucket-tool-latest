// Shared Tailwind classes for the dashboard layout (sidebar, top bar) and the home pages.
// Uses the same palette as the landing, auth and projects pages.

// Box sizing and text colours are set on the layout's own parts and on redesigned pages only,
// so the inner pages that aren't redesigned yet keep their current look
const base =
  "text-brand-text leading-[1.5] [&_*]:box-border [&_*::before]:box-border [&_*::after]:box-border";

/* Layout */
export const layout = "min-h-screen bg-brand-surface-alt";
export const content = "min-h-screen pl-[260px] max-[1023px]:pl-0";
export const main = "p-8 max-[640px]:p-4";
export const backdrop = "fixed inset-0 z-30 border-none bg-[rgba(31,29,58,0.35)] cursor-pointer min-[1024px]:hidden";

/* Sidebar (a drawer below 1024px) */
const sidebarBase = `${base} fixed inset-y-0 left-0 z-40 flex flex-col w-[260px] border-r border-brand-border bg-brand-surface transition-[transform,visibility] duration-200 ease-[ease] motion-reduce:transition-none`;
export const sidebar = `${sidebarBase} max-[1023px]:invisible max-[1023px]:-translate-x-full`;
export const sidebarOpen = `${sidebarBase} max-[1023px]:shadow-brand`;
export const sidebarBrandRow = "flex items-center justify-between h-16 px-5 shrink-0";
export const brand = "flex items-center gap-2 no-underline text-brand-ink";
export const brandLogo = "w-[28px] h-[28px]";
export const brandName = "text-[19px] font-bold tracking-[-0.01em]";
export const sidebarSection = "px-3";
export const nav = "flex-1 overflow-y-auto px-3 py-2";
export const navList = "flex flex-col gap-0.5 m-0 p-0 list-none";
export const navLabel = "mt-6 mb-1.5 px-3 text-[12px] font-bold tracking-[0.08em] uppercase text-brand-muted";
const navLinkBase =
  "flex items-center gap-3 h-10 px-3 rounded-lg text-[15px] font-semibold no-underline transition-[background-color,color] duration-150 ease-[ease] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-primary motion-reduce:transition-none";
export const navLink = `${navLinkBase} text-brand-text hover:bg-brand-surface-alt hover:text-brand-ink`;
export const navLinkActive = `${navLinkBase} bg-brand-soft text-brand-strong`;
export const navIcon = "shrink-0 text-[18px]";
export const sidebarFooter = "shrink-0 p-3 border-t border-brand-border";

/* Buttons that open a menu (project switcher, account) */
export const menuTrigger =
  "flex items-center gap-3 w-full p-2 border border-transparent rounded-[10px] bg-transparent [font-family:inherit] text-left cursor-pointer transition-[background-color,border-color] duration-150 ease-[ease] hover:bg-brand-surface-alt aria-expanded:border-brand-border aria-expanded:bg-brand-surface-alt focus-visible:outline-2 focus-visible:outline-brand-primary motion-reduce:transition-none";
export const triggerText = "flex-1 min-w-0";
export const triggerTitle = "truncate text-[15px] font-semibold text-brand-ink capitalize";
export const triggerSubtitle = "truncate text-[13px] text-brand-muted capitalize";
export const triggerChevron = "shrink-0 text-[16px] text-brand-muted";
export const projectAvatar =
  "flex shrink-0 items-center justify-center w-9 h-9 rounded-[10px] bg-brand-soft text-[16px] font-bold text-brand-strong uppercase";
export const userAvatar =
  "flex shrink-0 items-center justify-center w-9 h-9 rounded-[50%] bg-brand-strong text-[15px] font-bold text-white uppercase";
export const userEmail = "truncate text-[13px] text-brand-muted";

/* MUI Menu contents (MUI renders the menu in a portal, outside the sidebar) */
export const menuPaper = "mt-1 min-w-[240px] border border-brand-border rounded-xl! shadow-brand!";
export const menuHeading = "px-4 pt-2 pb-1 text-[12px] font-bold tracking-[0.08em] uppercase text-brand-muted";
export const menuItem = "gap-3 min-h-10! px-4! [font-family:inherit]! text-[14px]! font-semibold! text-brand-ink! no-underline";
export const menuItemIcon = "shrink-0 text-[16px] text-brand-muted";
export const menuItemProject = "flex-1 min-w-0 truncate capitalize";
export const menuItemCheck = "shrink-0 text-[15px] text-brand-strong";
export const menuItemMuted = "px-4 py-2 text-[14px] text-brand-muted";

/* Top bar */
export const topBar = `${base} sticky top-0 z-20 flex items-center gap-3 h-16 px-8 border-b border-brand-border bg-brand-surface max-[640px]:px-4`;
export const iconButton =
  "flex shrink-0 items-center justify-center w-10 h-10 border-none rounded-[10px] bg-transparent text-[20px] text-brand-text no-underline cursor-pointer transition-[background-color,color] duration-150 ease-[ease] hover:bg-brand-surface-alt hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-brand-primary motion-reduce:transition-none";
export const menuButton = `${iconButton} min-[1024px]:hidden`;
export const pageTitle = "flex-1 min-w-0 truncate text-[20px] font-bold tracking-[-0.01em] text-brand-ink";
export const search =
  "flex items-center gap-2 w-[260px] h-10 px-3 border border-brand-border rounded-[10px] bg-brand-surface-alt text-brand-muted focus-within:border-brand-primary focus-within:bg-brand-surface focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)] max-[768px]:hidden";
export const searchInput =
  "flex-1 min-w-0 border-none bg-transparent outline-none [font-family:inherit] text-[14px] text-brand-ink placeholder:text-brand-muted";

/* Home page */
export const home = `${base} flex flex-col gap-6 max-w-[1200px]`;
export const greeting = "mb-1 text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-brand-ink";
export const greetingText = "text-[15px]";
export const greetingProject = "font-semibold text-brand-ink capitalize";

export const card = "p-6 border border-brand-border rounded-brand bg-brand-surface max-[640px]:p-5";
export const cardHeader = "flex items-center justify-between gap-3 mb-4";
export const cardTitle = "text-[16px] font-bold text-brand-ink";
export const cardLink = "text-[14px] font-semibold text-brand-strong no-underline hover:underline";

export const statGrid =
  "grid grid-cols-[repeat(4,minmax(0,1fr))] gap-4 max-[1100px]:grid-cols-[repeat(2,minmax(0,1fr))] max-[480px]:gap-3";
export const statCard =
  "flex items-center gap-4 p-5 border border-brand-border rounded-brand bg-brand-surface max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-3 max-[480px]:p-4";
export const statIcon = "flex shrink-0 items-center justify-center w-11 h-11 rounded-[10px] text-[20px]";
export const statValue = "text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-brand-ink";
export const statLabel = "text-[14px]";

export const homeGrid = "grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 items-start max-[1100px]:grid-cols-[minmax(0,1fr)]";

/* Progress card */
export const progressValue = "text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-brand-ink";
export const progressCaption = "mb-4 text-[14px]";
export const progressBar = "flex h-2.5 overflow-hidden rounded-full bg-brand-border";
export const legend = "flex flex-col gap-2.5 mt-5 m-0 p-0 list-none";
export const legendItem = "flex items-center gap-2.5 text-[14px]";
export const legendDot = "shrink-0 w-2.5 h-2.5 rounded-[50%]";
export const legendValue = "ml-auto font-semibold text-brand-ink";

/* Open tasks list */
export const taskList = "flex flex-col m-0 p-0 list-none";
export const taskRow = "flex items-center gap-3 py-3 border-t border-brand-border first:border-t-0 first:pt-0 last:pb-0";
export const taskKey = "shrink-0 w-[72px] truncate text-[13px] font-semibold text-brand-muted uppercase max-[480px]:hidden";
export const taskName = "flex-1 min-w-0 truncate text-[15px] text-brand-ink";
export const statusPill = "shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold whitespace-nowrap";
export const priorityIcon = "shrink-0 text-[14px]";

/* Empty states inside a card */
export const emptyCard = "flex flex-col items-center py-8 text-center";
export const emptyIcon =
  "flex items-center justify-center w-14 h-14 mb-4 rounded-[50%] bg-brand-soft text-[24px] text-brand-strong";
export const emptyTitle = "mb-1 text-[16px] font-bold text-brand-ink";
export const emptyText = "mb-5 text-[14px]";

/* "No team members" banner */
export const banner = "flex items-center gap-4 p-5 border border-[#f3dfb4] rounded-brand bg-[#fff8ea] max-[640px]:flex-col max-[640px]:items-start";
export const bannerIcon = "flex shrink-0 items-center justify-center w-10 h-10 rounded-[50%] bg-[#fdecc8] text-[18px] text-[#b7791f]";
export const bannerText = "flex-1 text-[15px]";
export const bannerTitle = "font-semibold text-brand-ink";

/* Buttons – same shape as the projects pages */
export const btnPrimary =
  "inline-flex shrink-0 items-center justify-center gap-2 h-10 px-4 border border-transparent rounded-[10px] bg-brand-strong [font-family:inherit] text-[14px] font-semibold text-white no-underline whitespace-nowrap cursor-pointer transition-[background-color] duration-150 ease-[ease] hover:bg-[#4f49b8] hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-primary motion-reduce:transition-none";
