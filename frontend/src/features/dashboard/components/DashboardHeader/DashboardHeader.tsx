import React from "react";
import { Link } from "react-router-dom";
import { FiBell, FiMenu, FiSearch } from "react-icons/fi";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

interface DashboardHeaderProps {
  title: string;
  /** This project's Notifications page */
  notificationsLink: string;
  onMenuClick: () => void;
}

// Top bar of the dashboard: page title, search and notifications (the menu button shows below 1024px)
const DashboardHeader = ({ title, notificationsLink, onMenuClick }: DashboardHeaderProps) => {
  return (
    <header className={dashboard.topBar}>
      <button type="button" className={dashboard.menuButton} onClick={onMenuClick} aria-label="Open menu">
        <FiMenu />
      </button>
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
