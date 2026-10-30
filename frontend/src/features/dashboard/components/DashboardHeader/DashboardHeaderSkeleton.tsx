import React from "react";
import { Skeleton } from "@mui/material";

// Loading state of DashboardHeader: logo + name, search box, notification and profile icons
const DashboardHeaderSkeleton = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-1000 flex justify-between items-center py-[15px] px-[2%] bg-white shadow-[0_.5rem_1.5rem_rgba(0,0,0,.1)]">
      <div className="flex items-center gap-[5px]">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={150} sx={{ fontSize: 28 }} />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton variant="rounded" width={200} height={37} sx={{ mr: "10px", borderRadius: "5px" }} />
        <Skeleton variant="circular" width={30} height={30} />
        <Skeleton variant="circular" width={30} height={30} />
      </div>
    </div>
  );
};

export default DashboardHeaderSkeleton;
