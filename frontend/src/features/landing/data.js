import {
  FaProjectDiagram,
  FaColumns,
  FaFlag,
  FaListUl,
  FaComments,
  FaStickyNote,
  FaBell,
  FaHistory,
  FaBug,
  FaBuilding,
  FaChartBar,
  FaGoogle,
} from "react-icons/fa";

import avatar1 from "shared/assets/images/avatar1.png";
import avatar2 from "shared/assets/images/avatar2.png";
import avatar3 from "shared/assets/images/avatar3.png";
import avatar4 from "shared/assets/images/avatar4.png";

export const navLinks = [
  { id: "features", title: "Features" },
  { id: "how-it-works", title: "How it works" },
  { id: "pricing", title: "Pricing" },
];

// Sample cards shown in the hero board preview
export const boardColumns = [
  {
    title: "To Do",
    type: "todo",
    tasks: [
      { key: "PB-14", name: "Write onboarding guide", priority: "LOW", avatar: avatar1 },
      { key: "PB-15", name: "Design settings page", priority: "MEDIUM", avatar: avatar2 },
    ],
  },
  {
    title: "In Progress",
    type: "inprogress",
    tasks: [
      { key: "PB-11", name: "Build login API", priority: "HIGH", avatar: avatar3, subtasks: "2/3" },
    ],
  },
  {
    title: "Completed",
    type: "completed",
    tasks: [
      { key: "PB-08", name: "Set up project board", priority: "MEDIUM", avatar: avatar4 },
      { key: "PB-09", name: "Invite the team", priority: "LOW", avatar: avatar1 },
    ],
  },
];

export const features = [
  {
    icon: FaProjectDiagram,
    title: "Projects in a few clicks",
    description:
      "Pick a template, choose a personal or team project and you are ready to plan.",
  },
  {
    icon: FaColumns,
    title: "Task board",
    description:
      "See every task in To Do, In Progress and Completed, and move work forward as it happens.",
  },
  {
    icon: FaFlag,
    title: "Priorities & assignees",
    description:
      "Mark tasks High, Medium or Low and assign them so everyone knows who owns what.",
  },
  {
    icon: FaListUl,
    title: "Subtasks",
    description:
      "Break big tasks into smaller steps and see how far along each task is.",
  },
  {
    icon: FaComments,
    title: "Comments",
    description:
      "Discuss work right on the task, so decisions stay next to the work they are about.",
  },
  {
    icon: FaStickyNote,
    title: "Project notes",
    description:
      "Keep meeting notes, ideas and decisions next to the project they belong to.",
  },
];

export const projectTypes = [
  {
    type: "personal",
    title: "Personal projects",
    description: "For the work you plan and track on your own.",
    points: [
      "A dashboard with your task counts",
      "A board for all of your work",
      "Notes for every project",
    ],
  },
  {
    type: "team",
    title: "Team projects",
    description: "For work you share with the people you build with.",
    points: [
      "Everything in personal projects",
      "Invite team members by email",
      "Admin and member roles",
    ],
  },
];

export const steps = [
  {
    title: "Create your free account",
    description: "Sign up with your email and verify it to get started.",
  },
  {
    title: "Set up a project",
    description: "Choose a template and whether it is a personal or a team project.",
  },
  {
    title: "Plan and track tasks",
    description: "Add tasks, set priorities and move them across the board until they are done.",
  },
];

export const comingSoon = [
  { icon: FaBug, title: "Bug tracking" },
  { icon: FaBuilding, title: "Company-managed projects" },
  { icon: FaChartBar, title: "Reports & charts" },
  { icon: FaGoogle, title: "Google sign-in" },
  { icon: FaBell, title: "Notifications" },
  { icon: FaHistory, title: "Task history" },
];

export const plans = [
  {
    name: "Personal",
    price: "INR 0",
    period: "for user/month",
    users: "up to single user",
    note: "Free Forever",
  },
  {
    name: "Team",
    price: "INR 199",
    period: "for whole team",
    users: "Free up to 5-6 user",
    note: "Starts at 2,199/year",
  },
  {
    name: "Enterprise",
    price: "INR 599",
    period: "for whole organization",
    users: "up to 15-20 user",
    note: "Starts at 6,999/year",
  },
];
