import React from "react";
import { Skeleton } from "@mui/material";

// Shown in the dashboard content area while the Trash page's code is loading (the empty-trash image and text)
const TrashSkeleton = () => {
  return (
    <div className="w-[70%] mx-auto" aria-busy="true">
      {/* trash.png is 1160×675 */}
      <Skeleton variant="rounded" width="100%" sx={{ aspectRatio: "1160 / 675", height: "auto" }} />
      <div className="flex flex-col items-center">
        <Skeleton variant="text" width="40%" sx={{ fontSize: 26 }} />
        <Skeleton variant="text" width="70%" sx={{ fontSize: 17 }} />
      </div>
    </div>
  );
};

export default TrashSkeleton;
