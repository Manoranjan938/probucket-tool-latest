import React from "react";
import { Skeleton } from "@mui/material";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

// Loading state of DashboardHeader: menu or collapse button, page title, search and notifications
const DashboardHeaderSkeleton = () => {
  return (
    <div className={dashboard.topBar}>
      <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: "10px" }} />
      <div className="flex-1">
        <Skeleton variant="text" width={140} sx={{ fontSize: 20 }} />
      </div>
      {/* Wrapped, as MUI's own display style would win over a hidden class on the Skeleton */}
      <span className="max-[768px]:hidden">
        <Skeleton variant="rounded" width={260} height={40} sx={{ borderRadius: "10px" }} />
      </span>
      <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: "10px" }} />
    </div>
  );
};

export default DashboardHeaderSkeleton;
