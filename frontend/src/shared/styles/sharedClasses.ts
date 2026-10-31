// Tailwind classes used across several features

// 1px grey line between sections (sidebar, forms and modals)
export const divider = "w-full h-px my-[15px] bg-[#e5e5e5]";

// Search box in the dashboard, task and notes headers
export const searchField = "flex justify-center w-full mr-2.5 p-1.5 border-2 border-[#e5e5e5] rounded-[5px]";
export const searchInput = "border-none outline-none font-bold text-[#929191]";
export const searchIcon = "text-[#929191]";

// Purple button (plain <button>s on the pages that aren't redesigned yet)
export const button =
  "flex justify-center w-auto my-2.5 py-2 px-5 border-none rounded-[5px] bg-[#827ed8] text-[16px] font-semibold text-white cursor-pointer";

// White card inside an MUI Modal, with a title row and a close icon (NewTask, NewSubTask, NewNote)
export const modalCard = "w-[500px] h-auto my-[5%] mx-auto p-4 rounded-[10px] bg-white outline-none";
export const modalHeader = "flex justify-between items-center";
export const modalClose = "text-[26px] cursor-pointer";

// Spacing around an MUI TextField in a form (needs ! to win over MUI's own margin)
export const formField = "mt-2.5! mb-5!";
export const formFieldCompact = "mt-2.5! mb-2.5!";

// Smaller modal card used to update a task or a team member (ExtraDetails, NewUser)
export const smallModalCard = "w-[350px] my-[5%] mx-auto p-4 rounded-[10px] bg-white outline-none";
export const smallModalClose = "text-[20px] cursor-pointer";
