import React, { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { FiX } from "react-icons/fi";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import logo from "shared/assets/images/logo.png";
import ProjectSwitcher from "features/dashboard/components/ProjectSwitcher/ProjectSwitcher";
import AccountMenu from "features/dashboard/components/AccountMenu/AccountMenu";
import { dashboardLink, mainNav, manageNav, visibleNav, type DashboardType, type NavItem } from "features/dashboard/data";
import useGetProjectDetails from "features/projects/hooks/useGetProjectDetails";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { setCurrentProject } from "features/projects/store/projectSlice";

type Props = {
  type: DashboardType;
  id: string | null;
  name: string | null;
  /** Drawer state below 1024px; the sidebar is always shown above that */
  open: boolean;
  /** Icon rail above 1024px: only the icons show, with their names as tooltips */
  collapsed: boolean;
  onClose: () => void;
};

// Sidebar of the personal and team dashboards: project switcher, page links and the account menu
const Sidebar = ({
  type,
  id,
  name,
  open,
  collapsed,
  onClose,
}: Props) => {
  const currentUser = useAppSelector((state) => state.security.user);
  const currentProject = useAppSelector((state) => state.project.project);
  const dispatch = useAppDispatch();
  const [project, getProjectDetails] = useGetProjectDetails();

  // Again when the project switcher opens another project of the same type
  useEffect(() => {
    getProjectDetails(id).catch(() => {});
  }, [id]);

  useEffect(() => {
    dispatch(setCurrentProject(project));
  }, [project]);

  const renderLinks = (items: NavItem[]) => (
    <ul className={dashboard.navList}>
      {visibleNav(items, type, currentUser.rolename).map((item) => (
        // On the li, as MUI's Tooltip would drop NavLink's className function
        <Tooltip key={item.path} title={collapsed ? item.title : ""} placement="right">
          <li>
            <NavLink
              to={dashboardLink(type, item.path, id, name)}
              className={({ isActive }) =>
                `${isActive ? dashboard.navLinkActive : dashboard.navLink} ${collapsed ? dashboard.navLinkCollapsed : ""}`
              }
              aria-label={collapsed ? item.title : undefined}
            >
              <item.icon className={dashboard.navIcon} aria-hidden="true" />
              {collapsed ? null : item.title}
            </NavLink>
          </li>
        </Tooltip>
      ))}
    </ul>
  );

  const sidebarClass = collapsed ? dashboard.sidebarCollapsed : open ? dashboard.sidebarOpen : dashboard.sidebar;

  return (
    <aside className={sidebarClass} aria-label="Project navigation">
      <div className={collapsed ? dashboard.sidebarBrandRowCollapsed : dashboard.sidebarBrandRow}>
        <Link to="/projects" className={dashboard.brand} aria-label={collapsed ? "ProBucket" : undefined}>
          <img src={logo} alt="" className={dashboard.brandLogo} />
          {collapsed ? null : <span className={dashboard.brandName}>ProBucket</span>}
        </Link>
        <button type="button" className={dashboard.menuButton} onClick={onClose} aria-label="Close menu">
          <FiX />
        </button>
      </div>

      <div className={dashboard.sidebarSection}>
        {/* From the store, so renaming the project in its settings shows here straight away */}
        <ProjectSwitcher project={currentProject} collapsed={collapsed} />
      </div>

      <nav className={dashboard.nav}>
        {renderLinks(mainNav)}
        {collapsed ? <hr className={dashboard.navDivider} /> : <p className={dashboard.navLabel}>Manage</p>}
        {renderLinks(manageNav)}
      </nav>

      <div className={dashboard.sidebarFooter}>
        <AccountMenu collapsed={collapsed} />
      </div>
    </aside>
  );
};

export default Sidebar;
