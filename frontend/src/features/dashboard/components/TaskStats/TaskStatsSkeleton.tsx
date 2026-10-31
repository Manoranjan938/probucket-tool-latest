import React from "react";
import { Skeleton } from "@mui/material";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

// Loading state of TaskStats: the four task count cards
const TaskStatsSkeleton = () => {
  return (
    <div className={dashboard.statGrid}>
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className={dashboard.statCard}>
          <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: "10px" }} className="shrink-0" />
          <div className="flex-1">
            <Skeleton variant="text" width={40} sx={{ fontSize: 26 }} />
            <Skeleton variant="text" width="70%" sx={{ fontSize: 14 }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskStatsSkeleton;
