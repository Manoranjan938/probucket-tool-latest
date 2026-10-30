import React from "react";
import type { PropsWithChildren } from "react";

import DashboardHeaderSkeleton from "features/dashboard/components/DashboardHeader/DashboardHeaderSkeleton";
import SidebarSkeleton from "features/dashboard/components/Sidebar/SidebarSkeleton";

// Shown while the personal dashboard layout's code is loading; children is the current page's skeleton
const DashboardScreenSkeleton = ({ children }: PropsWithChildren) => {
  return (
    <div aria-busy="true">
      <div>
        <DashboardHeaderSkeleton />
        <SidebarSkeleton mainLinks={4} />
      </div>
      <div className="pt-[100px] pl-[300px]">{children}</div>
    </div>
  );
};

export default DashboardScreenSkeleton;
