import React, { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import Sidebar from "features/dashboard/components/Sidebar/Sidebar";
import DashboardHeader from "features/dashboard/components/DashboardHeader/DashboardHeader";
import useSidebarCollapsed from "features/dashboard/hooks/useSidebarCollapsed";
import { dashboardLink, pageTitles, type DashboardType } from "features/dashboard/data";

// Frame of the personal and team dashboards; children is the current page
const DashboardLayout = ({ type, children }: PropsWithChildren<{ type: DashboardType }>) => {
  const { pathname, search } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, toggleSidebar] = useSidebarCollapsed();

  const query = new URLSearchParams(search);
  const projectId = query.get("project");
  const name = query.get("name");
  const title = pageTitles[pathname.split("/").pop() ?? ""] ?? "";

  // The drawer closes when a link in it is followed
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, search]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  return (
    <div className={dashboard.layout}>
      <Sidebar
        type={type}
        id={projectId}
        name={name}
        open={menuOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setMenuOpen(false)}
      />
      {menuOpen ? (
        <button
          type="button"
          className={dashboard.backdrop}
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          tabIndex={-1}
        />
      ) : null}

      <div className={sidebarCollapsed ? dashboard.contentCollapsed : dashboard.content}>
        <DashboardHeader
          title={title}
          notificationsLink={dashboardLink(type, "notifications", projectId, name)}
          onMenuClick={() => setMenuOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />
        {/* Keyed by project, so the page starts fresh when the project switcher opens another project */}
        <main key={projectId} className={dashboard.main}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
