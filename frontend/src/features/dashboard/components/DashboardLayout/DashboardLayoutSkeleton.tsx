import React from "react";
import type { PropsWithChildren } from "react";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import SidebarSkeleton from "features/dashboard/components/Sidebar/SidebarSkeleton";
import DashboardHeaderSkeleton from "features/dashboard/components/DashboardHeader/DashboardHeaderSkeleton";

// DashboardLayout while its code is loading; children is the current page's skeleton
const DashboardLayoutSkeleton = ({ mainLinks, children }: PropsWithChildren<{ mainLinks: number }>) => {
  return (
    <div className={dashboard.layout} aria-busy="true">
      <SidebarSkeleton mainLinks={mainLinks} />
      <div className={dashboard.content}>
        <DashboardHeaderSkeleton />
        <div className={dashboard.main}>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayoutSkeleton;
