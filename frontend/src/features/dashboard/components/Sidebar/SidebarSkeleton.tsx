import React from "react";
import { Skeleton } from "@mui/material";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import logo from "shared/assets/images/logo.png";

const LinkSkeleton = ({ collapsed }: { collapsed: boolean }) => (
  <li className={`flex items-center gap-3 h-10 ${collapsed ? "justify-center" : "px-3"}`}>
    <Skeleton variant="rounded" width={18} height={18} sx={{ borderRadius: "4px" }} className="shrink-0" />
    {collapsed ? null : <Skeleton variant="text" width="55%" sx={{ fontSize: 15 }} />}
  </li>
);

const TriggerSkeleton = ({ round, collapsed }: { round?: boolean; collapsed: boolean }) => (
  <div className={`flex items-center gap-3 ${collapsed ? "justify-center p-1" : "p-2"}`}>
    <Skeleton
      variant={round ? "circular" : "rounded"}
      width={36}
      height={36}
      sx={round ? undefined : { borderRadius: "10px" }}
      className="shrink-0"
    />
    {collapsed ? null : (
      <div className="flex-1">
        <Skeleton variant="text" width="70%" sx={{ fontSize: 15 }} />
        <Skeleton variant="text" width="50%" sx={{ fontSize: 13 }} />
      </div>
    )}
  </div>
);

// Loading state of Sidebar. mainLinks is the number of links in the first group
// (personal: Dashboard, Your work, Notes, Notifications; team admins also get Team members)
const SidebarSkeleton = ({ mainLinks, collapsed }: { mainLinks: number; collapsed: boolean }) => {
  return (
    <aside className={collapsed ? dashboard.sidebarCollapsed : dashboard.sidebar}>
      <div className={collapsed ? dashboard.sidebarBrandRowCollapsed : dashboard.sidebarBrandRow}>
        <span className={dashboard.brand}>
          <img src={logo} alt="" className={dashboard.brandLogo} />
          {collapsed ? null : <span className={dashboard.brandName}>ProBucket</span>}
        </span>
      </div>

      <div className={dashboard.sidebarSection}>
        <TriggerSkeleton collapsed={collapsed} />
      </div>

      <div className={dashboard.nav}>
        <ul className={dashboard.navList}>
          {Array.from({ length: mainLinks }, (_, index) => (
            <LinkSkeleton key={index} collapsed={collapsed} />
          ))}
        </ul>
        {collapsed ? <hr className={dashboard.navDivider} /> : <p className={dashboard.navLabel}>Manage</p>}
        <ul className={dashboard.navList}>
          <LinkSkeleton collapsed={collapsed} />
          <LinkSkeleton collapsed={collapsed} />
        </ul>
      </div>

      <div className={dashboard.sidebarFooter}>
        <TriggerSkeleton round collapsed={collapsed} />
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
