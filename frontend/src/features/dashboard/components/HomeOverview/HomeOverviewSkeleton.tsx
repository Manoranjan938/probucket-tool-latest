import React from "react";
import { Skeleton } from "@mui/material";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import BarRowsSkeleton from "features/dashboard/components/BarRow/BarRowsSkeleton";
import TaskRowsSkeleton from "features/dashboard/components/TaskRow/TaskRowsSkeleton";
import TaskStatsSkeleton from "features/dashboard/components/TaskStats/TaskStatsSkeleton";

const CardTitleSkeleton = ({ width }: { width: number }) => (
  <Skeleton variant="text" width={width} sx={{ fontSize: 16, mb: "12px" }} />
);

const TaskListCardSkeleton = () => (
  <div className={dashboard.card}>
    <CardTitleSkeleton width={120} />
    <TaskRowsSkeleton />
  </div>
);

const BarsCardSkeleton = () => (
  <div className={dashboard.card}>
    <CardTitleSkeleton width={130} />
    <BarRowsSkeleton />
  </div>
);

// Loading state of HomeOverview. The team dashboard has two more cards.
const HomeOverviewSkeleton = ({ team = false }: { team?: boolean }) => {
  return (
    <div className={dashboard.home} aria-busy="true">
      <div>
        <Skeleton variant="text" width={260} sx={{ fontSize: 24, maxWidth: "100%" }} />
        <Skeleton variant="text" width={300} sx={{ fontSize: 15, maxWidth: "100%" }} />
      </div>

      <TaskStatsSkeleton />

      <div className={dashboard.homeGrid}>
        <div className={dashboard.homeColumn}>
          {team ? <TaskListCardSkeleton /> : null}
          <TaskListCardSkeleton />
          <TaskListCardSkeleton />
          {team ? <BarsCardSkeleton /> : null}
        </div>
        <div className={dashboard.homeColumn}>
          <div className={dashboard.card}>
            <CardTitleSkeleton width={90} />
            <Skeleton variant="text" width={80} sx={{ fontSize: 32 }} />
            <Skeleton variant="text" width={140} sx={{ fontSize: 14, mb: "12px" }} />
            <Skeleton variant="rounded" height={10} sx={{ borderRadius: "999px" }} />
          </div>
          <BarsCardSkeleton />
          <div className={dashboard.card}>
            <CardTitleSkeleton width={120} />
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} variant="text" sx={{ fontSize: 14, my: "6px" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeOverviewSkeleton;
