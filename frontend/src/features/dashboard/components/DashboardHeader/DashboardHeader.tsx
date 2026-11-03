import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { FiBell, FiMenu, FiSearch, FiSidebar } from "react-icons/fi";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

interface DashboardHeaderProps {
  title: string;
  /** This project's Notifications page */
  notificationsLink: string;
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

// Top bar of the dashboard: page title, search and notifications
// (the menu button shows below 1024px, the button that collapses the sidebar above that)
const DashboardHeader = ({
  title,
  notificationsLink,
  onMenuClick,
  sidebarCollapsed,
  onToggleSidebar,
}: DashboardHeaderProps) => {
  const collapseLabel = sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar";

  return (
    <header className={dashboard.topBar}>
      <button type="button" className={dashboard.menuButton} onClick={onMenuClick} aria-label="Open menu">
        <FiMenu />
      </button>
      <Tooltip title={collapseLabel}>
        <button
          type="button"
          className={dashboard.collapseButton}
          onClick={onToggleSidebar}
          aria-label={collapseLabel}
          aria-expanded={!sidebarCollapsed}
        >
          <FiSidebar />
        </button>
      </Tooltip>
      <h1 className={dashboard.pageTitle}>{title}</h1>

      {/* Not wired up yet – kept so the header looks complete */}
      <label className={dashboard.search}>
        <FiSearch aria-hidden="true" />
        <input type="search" placeholder="Search" aria-label="Search" className={dashboard.searchInput} />
      </label>
      <Link to={notificationsLink} className={dashboard.iconButton} aria-label="Notifications">
        <FiBell />
      </Link>
    </header>
  );
};

export default DashboardHeader;
