import { MdDashboard } from "react-icons/md";
import {
  IoNotifications,
} from "react-icons/io5";
import { GoProject, GoIssueClosed } from "react-icons/go";
import { BiNotepad, BiUserPlus } from "react-icons/bi";
import { RiTodoLine } from "react-icons/ri";
import { BsBug } from "react-icons/bs";

export const teamSidebarData = [
  {
    id: 1,
    title: "Dashboard",
    icon: <MdDashboard />,
    path: "/project/team/home"
  },
  {
    id: 3,
    title: "Your Work",
    icon: <GoProject />,
    path: "/project/team/works"
  },
  {
    id: 2,
    title: "Bug",
    icon: <BsBug />,
    path: "/project/team/bug"
  },
  {
    id: 4,
    title: "Notes",
    icon: <BiNotepad />,
    path: "/project/team/notes"
  },
  {
    id: 7,
    title: "Issues",
    icon: <GoIssueClosed />,
    path: "/project/team/issues"
  },
  {
    id: 5,
    title: "Todo",
    icon: <RiTodoLine />,
    path: "/project/team/todos"
  },
  {
    id: 6,
    title: "Notifications",
    icon: <IoNotifications />,
    path: "/project/team/notifications",
    notiCount: 5
  },
  {
    id: 8,
    title: "Add User",
    icon: <BiUserPlus />,
    path: "/project/team/new-user",
  },
];
