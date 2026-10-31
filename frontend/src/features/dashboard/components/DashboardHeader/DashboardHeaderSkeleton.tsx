import React from "react";
import { Skeleton } from "@mui/material";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

// Loading state of DashboardHeader: menu button (below 1024px), page title, search and notifications
const DashboardHeaderSkeleton = () => {
  return (
    <div className={dashboard.topBar}>
      {/* Wrapped, as MUI's own display style would win over a hidden class on the Skeleton */}
      <span className="min-[1024px]:hidden">
        <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: "10px" }} />
      </span>
      <div className="flex-1">
        <Skeleton variant="text" width={140} sx={{ fontSize: 20 }} />
      </div>
      <span className="max-[768px]:hidden">
        <Skeleton variant="rounded" width={260} height={40} sx={{ borderRadius: "10px" }} />
      </span>
      <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: "10px" }} />
    </div>
  );
};

export default DashboardHeaderSkeleton;
