// Shared Tailwind classes for the Your work page: board, task cards, task details and the task dialogs.
// Uses the same palette as the dashboard (see features/dashboard/styles/dashboardClasses.ts).

const base =
  "text-brand-text leading-[1.5] [&_*]:box-border [&_*::before]:box-border [&_*::after]:box-border";

export const page = `${base} flex flex-col gap-5`;

/* Toolbar above the board */
export const toolbar = "flex items-center gap-4 flex-wrap";
// Below 640px the toolbar's parts wrap on their own: the search box takes a full row
export const toolbarStart = "flex items-center gap-4 flex-1 min-w-0 max-[640px]:contents";
export const toolbarButton = "ml-auto";
export const taskCount = "text-[15px]";
export const search =
  "flex items-center gap-2 w-[240px] h-10 px-3 border border-brand-border rounded-[10px] bg-brand-surface text-brand-muted focus-within:border-brand-primary focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)] max-[640px]:w-full";
export const searchInput =
  "flex-1 min-w-0 border-none bg-transparent outline-none [font-family:inherit] text-[14px] text-brand-ink placeholder:text-brand-muted";
export const avatarStack = "flex items-center";
const avatarBase =
  "flex shrink-0 items-center justify-center rounded-[50%] font-bold uppercase";
export const avatar = `${avatarBase} w-8 h-8 bg-brand-strong text-[13px] text-white`;
export const avatarStacked = `${avatar} -ml-2 first:ml-0 border-2 border-brand-surface-alt`;
export const avatarMore = `${avatarBase} w-8 h-8 -ml-2 border-2 border-brand-surface-alt bg-brand-border text-[12px] text-brand-text`;
export const avatarLarge = `${avatarBase} w-9 h-9 bg-brand-strong text-[14px] text-white`;

/* Buttons – same shape as the dashboard buttons */
const btn =
  "inline-flex shrink-0 items-center justify-center gap-2 h-10 px-4 border rounded-[10px] [font-family:inherit] text-[14px] font-semibold no-underline whitespace-nowrap cursor-pointer transition-[background-color,border-color,color] duration-150 ease-[ease] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none";
export const btnPrimary = `${btn} border-transparent bg-brand-strong text-white hover:bg-[#4f49b8] disabled:hover:bg-brand-strong`;
export const btnGhost = `${btn} border-brand-border bg-brand-surface text-brand-ink hover:border-brand-primary hover:text-brand-strong`;
export const btnSmall = "h-8! px-3! text-[13px]!";
export const iconButton =
  "flex shrink-0 items-center justify-center w-8 h-8 border-none rounded-lg bg-transparent text-[16px] text-brand-muted cursor-pointer transition-[background-color,color] duration-150 ease-[ease] hover:bg-brand-surface-alt hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-brand-primary motion-reduce:transition-none";

/* Board */
export const board =
  "grid grid-cols-[repeat(3,minmax(260px,1fr))] gap-4 items-start overflow-x-auto pb-2 max-[900px]:grid-cols-[repeat(3,minmax(260px,82vw))]";
export const column = "flex flex-col gap-3 min-h-[200px] p-3 rounded-brand bg-[#efeef6]";
export const columnHeader = "flex items-center gap-2 h-8 px-1";
export const columnDot = "shrink-0 w-2.5 h-2.5 rounded-[50%]";
export const columnTitle = "text-[14px] font-bold text-brand-ink";
export const columnCount =
  "inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-brand-surface text-[12px] font-semibold text-brand-text";
export const columnActions = "flex items-center gap-0.5 ml-auto";
export const columnEmpty = "py-6 text-center text-[14px] text-brand-muted";
export const cardList = "flex flex-col gap-2.5 m-0 p-0 list-none";

/* Task card (a button that opens the task) */
export const card =
  "flex flex-col gap-3 w-full p-3.5 border border-brand-border rounded-xl bg-brand-surface [font-family:inherit] text-left cursor-pointer shadow-[0_1px_2px_rgba(31,29,58,0.05)] transition-[border-color,box-shadow] duration-150 ease-[ease] hover:border-[#d4d2f2] hover:shadow-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-primary motion-reduce:transition-none";
export const cardSelected = `${card} border-brand-primary! shadow-[0_0_0_1px_var(--color-brand-primary)]!`;
export const cardName = "line-clamp-3 text-[14px] font-semibold leading-[1.45] text-brand-ink";
export const cardFooter = "flex items-center gap-2";
export const cardKey = "text-[12px] font-semibold uppercase text-brand-muted";
export const cardAssign =
  "flex items-center justify-center w-6 h-6 ml-auto border border-dashed border-brand-muted rounded-[50%] text-[11px] text-brand-muted";

/* Priority */
export const priority = "inline-flex items-center gap-1 text-[12px] font-semibold capitalize";

/* Status pill */
export const statusPill =
  "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-semibold whitespace-nowrap";
export const statusButton =
  "inline-flex items-center gap-1.5 h-9 pl-3 pr-2 border-none rounded-[10px] [font-family:inherit] text-[14px] font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

/* Empty state */
export const empty =
  "flex flex-col items-center max-w-[460px] mx-auto mt-[6vh] p-10 border border-brand-border rounded-2xl bg-brand-surface text-center shadow-brand max-[480px]:px-5 max-[480px]:py-8";
export const emptyIcon =
  "flex items-center justify-center w-16 h-16 mb-5 rounded-[50%] bg-brand-soft text-[26px] text-brand-strong";
export const emptyTitle = "mb-2 text-[20px] font-bold text-brand-ink";
export const emptyText = "mb-6 text-[15px]";

/* Task details – side panel (MUI Drawer) or centered modal (MUI Dialog) */
export const panelPaper = `${base} w-[600px] max-w-full! bg-brand-surface!`;
export const modalPaper = `${base} w-full max-w-[1100px]! h-[min(860px,calc(100vh-64px))] m-4! rounded-2xl! bg-brand-surface!`;
export const details = "flex flex-col h-full";
export const detailsHeader = "flex items-center gap-2 h-14 shrink-0 px-5 border-b border-brand-border";
export const detailsKey = "flex items-center gap-2 text-[14px] font-semibold uppercase text-brand-muted";
export const taskTypeIcon =
  "flex items-center justify-center w-5 h-5 rounded-[5px] bg-[#2cceb8] text-[12px] text-white";
export const detailsActions = "flex items-center gap-0.5 ml-auto";
export const detailsDivider = "w-px h-5 mx-1 bg-brand-border";
export const detailsBody = "flex-1 overflow-y-auto";
export const detailsGridPanel = "flex flex-col gap-6 p-6 max-[480px]:p-4";
export const detailsGridModal = "grid grid-cols-[minmax(0,1fr)_320px] gap-8 p-8 max-[900px]:grid-cols-[minmax(0,1fr)] max-[900px]:p-5";
export const detailsMain = "flex flex-col gap-6 min-w-0";
export const detailsSide = "flex flex-col gap-4 min-w-0";
export const taskTitle = "text-[22px] font-bold leading-[1.3] tracking-[-0.01em] text-brand-ink break-words";
export const actionsRow = "flex items-center gap-2 flex-wrap";

export const section = "flex flex-col gap-2.5";
export const sectionHeader = "flex items-center justify-between gap-2";
export const sectionTitle = "text-[14px] font-bold text-brand-ink";
export const sectionCount = "ml-1.5 font-semibold text-brand-muted";

export const sideCard = "p-4 border border-brand-border rounded-xl bg-brand-surface";
export const sideCardTitle = "mb-3 text-[13px] font-bold tracking-[0.06em] uppercase text-brand-muted";
export const detailRow = "grid grid-cols-[110px_minmax(0,1fr)] items-center gap-3 min-h-9 text-[14px]";
export const detailLabel = "text-brand-muted";
export const detailValue = "flex items-center gap-2 min-w-0 font-semibold text-brand-ink";
export const linkButton =
  "p-0 border-none bg-transparent [font-family:inherit] text-[13px] font-semibold text-brand-strong cursor-pointer hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

/* Subtask progress */
export const progressRow = "flex items-center gap-3 text-[13px] [&+&]:mt-2.5";
export const progressLabel = "w-[84px] shrink-0";
export const progressTrack = "flex-1 h-2 overflow-hidden rounded-full bg-brand-border";
export const progressValue = "w-10 shrink-0 text-right font-semibold text-brand-ink";

/* Subtasks */
export const subtaskList = "flex flex-col m-0 p-0 list-none border border-brand-border rounded-xl overflow-hidden";
export const subtaskRow =
  "flex items-center gap-3 px-3 py-2.5 bg-brand-surface [&+&]:border-t [&+&]:border-brand-border";
export const subtaskIcon =
  "flex shrink-0 items-center justify-center w-5 h-5 rounded-[5px] bg-[#4acef9] text-[11px] text-white";
export const subtaskKey = "shrink-0 text-[12px] font-semibold uppercase text-brand-muted";
export const subtaskName = "flex-1 min-w-0 truncate text-[14px] text-brand-ink";
export const subtaskMeta = "flex shrink-0 items-center gap-1";
export const orderBy =
  "inline-flex items-center gap-1 h-8 px-2 border-none rounded-lg bg-transparent [font-family:inherit] text-[13px] font-semibold text-brand-text cursor-pointer hover:bg-brand-surface-alt";

/* Form fields */
export const field = "flex flex-col gap-1.5 [&+&]:mt-4";
export const label = "text-[14px] font-semibold text-brand-ink";
const inputBase =
  "w-full px-3.5 border border-brand-border rounded-[10px] bg-brand-surface [font-family:inherit] text-[15px] text-brand-ink transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-brand-muted focus:outline-none focus:border-brand-primary focus:shadow-[0_0_0_3px_var(--color-brand-soft)] aria-invalid:border-brand-danger motion-reduce:transition-none";
export const input = `${inputBase} h-11 py-0`;
export const textarea = `${inputBase} min-h-[96px] py-3 leading-[1.5] resize-y`;
export const error = "text-[13px] font-medium text-brand-danger";
export const formActions = "flex items-center gap-2";

/* Priority picker (radio buttons styled as a segmented control) */
export const segmented = "grid grid-cols-3 gap-1 p-1 rounded-[10px] bg-brand-surface-alt border border-brand-border";
export const segment =
  "flex items-center justify-center gap-1.5 h-9 rounded-lg text-[14px] font-semibold text-brand-text cursor-pointer has-checked:bg-brand-surface has-checked:text-brand-ink has-checked:shadow-[0_1px_2px_rgba(31,29,58,0.12)] has-focus-visible:outline-2 has-focus-visible:outline-brand-primary";

/* Small dialogs (new task, new subtask, change assignee) */
export const dialogPaper = `${base} w-full max-w-[460px]! m-4! rounded-2xl! bg-brand-surface!`;
export const dialogHeader = "flex items-center justify-between gap-3 px-6 pt-5 pb-1";
export const dialogTitle = "text-[18px] font-bold text-brand-ink";
export const dialogBody = "px-6 pt-3 pb-2";
export const dialogFooter = "flex items-center justify-end gap-2 px-6 pt-4 pb-5";

/* Activity tabs and comments */
export const tabs = "flex items-center gap-1 p-1 w-fit rounded-[10px] bg-brand-surface-alt";
export const tab =
  "h-8 px-3 border-none rounded-lg bg-transparent [font-family:inherit] text-[13px] font-semibold text-brand-text cursor-pointer";
export const tabActive = `${tab} bg-brand-surface! text-brand-ink! shadow-[0_1px_2px_rgba(31,29,58,0.12)]`;
export const comment = "flex gap-3";
export const commentBody = "flex-1 min-w-0";
export const commentMeta = "flex items-baseline gap-2 mb-0.5";
export const commentAuthor = "text-[14px] font-semibold text-brand-ink";
export const commentDate = "text-[12px] text-brand-muted";
export const commentText = "text-[14px] text-brand-ink whitespace-pre-wrap break-words";
export const commentList = "flex flex-col gap-4 m-0 p-0 list-none";
