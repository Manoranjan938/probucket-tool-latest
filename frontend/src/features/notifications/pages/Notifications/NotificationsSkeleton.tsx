import React from "react";
import { Skeleton } from "@mui/material";

// Shown in the dashboard content area while the Notifications page's code is loading (one notification, like the page)
const NotificationsSkeleton = () => {
  return (
    <div className="flex gap-[30px] w-auto my-[2%] mx-[10%] pb-2.5 border-b border-[#797777]" aria-busy="true">
      <Skeleton variant="circular" width={40} height={40} className="shrink-0" />
      <div className="flex-1">
        <div className="flex justify-between w-auto">
          <Skeleton variant="rounded" width={80} height={22} sx={{ borderRadius: "4px" }} />
          <Skeleton variant="text" width={80} />
        </div>
        <div className="mt-1.5">
          <Skeleton variant="text" width="40%" sx={{ fontSize: 16 }} />
          <Skeleton variant="text" width="55%" sx={{ fontSize: 14 }} />
        </div>
        <Skeleton variant="text" width={130} sx={{ mt: "10px" }} />
      </div>
    </div>
  );
};

export default NotificationsSkeleton;
