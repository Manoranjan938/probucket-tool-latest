import React from "react";
import { Skeleton } from "@mui/material";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import TaskStatsSkeleton from "features/dashboard/components/TaskStats/TaskStatsSkeleton";

// Loading state of HomeOverview: greeting, task counts, open tasks and progress
const HomeOverviewSkeleton = () => {
  return (
    <div className={dashboard.home} aria-busy="true">
      <div>
        <Skeleton variant="text" width={260} sx={{ fontSize: 24, maxWidth: "100%" }} />
        <Skeleton variant="text" width={300} sx={{ fontSize: 15, maxWidth: "100%" }} />
      </div>

      <TaskStatsSkeleton />

      <div className={dashboard.homeGrid}>
        <div className={dashboard.card}>
          <Skeleton variant="text" width={120} sx={{ fontSize: 16, mb: "12px" }} />
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} variant="text" sx={{ fontSize: 15, my: "10px" }} />
          ))}
        </div>
        <div className={dashboard.card}>
          <Skeleton variant="text" width={90} sx={{ fontSize: 16, mb: "12px" }} />
          <Skeleton variant="text" width={80} sx={{ fontSize: 32 }} />
          <Skeleton variant="text" width={140} sx={{ fontSize: 14, mb: "12px" }} />
          <Skeleton variant="rounded" height={10} sx={{ borderRadius: "999px" }} />
        </div>
      </div>
    </div>
  );
};

export default HomeOverviewSkeleton;
