import React from "react";
import type { PropsWithChildren } from "react";

import DashboardHeaderSkeleton from "features/dashboard/components/DashboardHeader/DashboardHeaderSkeleton";
import SidebarSkeleton from "features/dashboard/components/Sidebar/SidebarSkeleton";

// Shown while the team dashboard layout's code is loading; children is the current page's skeleton
const TeamDashboardSkeleton = ({ children }: PropsWithChildren) => {
  return (
    <div aria-busy="true">
      <div>
        <DashboardHeaderSkeleton />
        <SidebarSkeleton mainLinks={5} />
      </div>
      <div className="h-full ml-[310px] pt-[100px]">{children}</div>
    </div>
  );
};

export default TeamDashboardSkeleton;
