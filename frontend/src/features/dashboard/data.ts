import { FiBell, FiCheckSquare, FiFileText, FiGrid, FiSettings, FiTrash2, FiUsers } from "react-icons/fi";
import type { IconType } from "react-icons";

/** The two dashboards – also the first part of their routes (/project/personal/*, /project/team/*) */
export type DashboardType = "personal" | "team";

export interface NavItem {
  /** Route under /project/{type}/ */
  path: string;
  title: string;
  icon: IconType;
  /** Only in the team dashboard */
  teamOnly?: boolean;
  /** Hidden from team members (ROLE_TEAM-USER) */
  adminOnly?: boolean;
}

// Sidebar links, in two groups
export const mainNav: NavItem[] = [
  { path: "home", title: "Dashboard", icon: FiGrid },
  { path: "works", title: "Your work", icon: FiCheckSquare },
  { path: "notes", title: "Notes", icon: FiFileText },
  { path: "new-user", title: "Team members", icon: FiUsers, teamOnly: true, adminOnly: true },
  { path: "notifications", title: "Notifications", icon: FiBell },
];

export const manageNav: NavItem[] = [
  { path: "setting", title: "Project settings", icon: FiSettings },
  { path: "trash", title: "Trash", icon: FiTrash2 },
];

// Top bar title of each route; todos and issues have routes but no sidebar link
export const pageTitles: Record<string, string> = {
  ...Object.fromEntries([...mainNav, ...manageNav].map((item) => [item.path, item.title])),
  todos: "Todos",
  issues: "Issues",
};

/** The sidebar links shown to this user in this dashboard */
export const visibleNav = (items: NavItem[], type: DashboardType, rolename: string | undefined) =>
  items.filter(
    (item) => (!item.teamOnly || type === "team") && (!item.adminOnly || rolename !== "ROLE_TEAM-USER")
  );

/** Link to a dashboard page; every page reads the project from the query string */
export const dashboardLink = (type: DashboardType, path: string, projectId: string | null, name: string | null) =>
  `/project/${type}/${path}?project=${projectId}&name=${name}`;
