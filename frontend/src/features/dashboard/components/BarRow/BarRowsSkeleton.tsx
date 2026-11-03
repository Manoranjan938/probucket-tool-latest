import React from "react";
import { Skeleton } from "@mui/material";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

// Loading state of a list of BarRows
const BarRowsSkeleton = ({ rows = 3 }: { rows?: number }) => {
  return (
    <div className={dashboard.barList} aria-busy="true">
      {Array.from({ length: rows }, (_, item) => (
        <div key={item}>
          <Skeleton variant="text" sx={{ fontSize: 14, mb: "6px" }} />
          <Skeleton variant="rounded" height={8} sx={{ borderRadius: "4px" }} />
        </div>
      ))}
    </div>
  );
};

export default BarRowsSkeleton;
