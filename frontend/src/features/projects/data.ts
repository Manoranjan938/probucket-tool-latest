import { FaBug, FaBuilding, FaColumns, FaLayerGroup, FaUser, FaUsers } from "react-icons/fa";

import type { ProjectOption } from "features/projects/types";

// Step 1 of the Create project wizard. `value` is sent to the backend as projectTemplate.
export const templates: ProjectOption[] = [
  {
    value: "project",
    title: "Project Management",
    description: "Plan your work on a board and track every task from to-do to done.",
    icon: FaColumns,
  },
  {
    value: "bug",
    title: "Bug Management",
    description: "Log bugs, set their priority and follow each one until it's fixed.",
    icon: FaBug,
  },
  {
    value: "project and bug",
    title: "Project & Bug Management",
    description: "Plan your tasks and track bugs together in one project.",
    icon: FaLayerGroup,
  },
];

/** The template a project uses. Projects without a known one only take tasks, like Project Management. */
export const templateOf = (value: string | undefined) =>
  templates.find((template) => template.value === value) ?? templates[0];

/** What changes for new items when a project moves to this template; existing items always stay as they are */
export const templateChangeNote: Record<string, string> = {
  project: "New items will be tasks. Bugs already in the project stay as they are.",
  bug: "New items will be bugs. Tasks already in the project stay as they are.",
  "project and bug": "New items can be tasks or bugs. Everything already in the project stays as it is.",
};

// Step 2. `value` is sent as projectType and is also the dashboard route (/project/personal, /project/team).
export const projectTypes: ProjectOption[] = [
  {
    value: "personal",
    title: "Personal",
    description: "Just you. Plan and track your own work.",
    icon: FaUser,
  },
  {
    value: "team",
    title: "Team",
    description: "Invite teammates, assign tasks and track progress together.",
    icon: FaUsers,
  },
  // There is no company dashboard yet (no /project/company route), so it can't be picked
  {
    value: "company",
    title: "Company",
    description: "Multiple teams under one organisation.",
    icon: FaBuilding,
    comingSoon: true,
  },
];
