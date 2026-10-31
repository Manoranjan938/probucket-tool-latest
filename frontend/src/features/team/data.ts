import type { TeamMember } from "features/team/types";

/** Suggested roles in the Edit member dialog; any other text can be typed too */
export const roleSuggestions = ["Developer", "Designer", "Tester", "Project manager"];

/** The member's role, or "" when none is set (the backend sends null or the string "null") */
export const memberRole = (member: TeamMember) =>
  member.role === null || member.role === "null" ? "" : member.role;

/** status is 0 for active members and 1 for inactive ones */
export const isActive = (member: TeamMember) => member.status === 0;

/** The temporary password in the backend's "...with temporary password: XYZ" message, if there is one */
export const temporaryPassword = (message: string) => message.match(/temporary password:\s*(\S+)/i)?.[1] ?? null;
