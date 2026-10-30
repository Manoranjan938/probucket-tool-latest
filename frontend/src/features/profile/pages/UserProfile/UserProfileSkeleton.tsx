import React from "react";
import { Skeleton } from "@mui/material";

// Shown while the Profile page's code is loading (the "Update your password" card)
const UserProfileSkeleton = () => {
  return (
    <div className="w-full" aria-busy="true">
      <div className="w-[400px] my-[2%] mx-auto p-4">
        <div className="flex justify-center items-center gap-1">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={140} sx={{ fontSize: 28 }} />
        </div>
        <div className="mt-5 p-10 rounded-[5px] shadow-[1px_10px_30px_#0003]">
          <div className="flex flex-col items-center">
            <Skeleton variant="text" width={180} sx={{ fontSize: 16 }} />
            <Skeleton variant="text" width={90} sx={{ fontSize: 18, mt: "12px" }} />
          </div>
          <div className="mt-5">
            <Skeleton variant="rounded" width={305} height={34} sx={{ my: "10px", borderRadius: "3px" }} />
            <Skeleton variant="rounded" height={35} sx={{ mt: "20px", borderRadius: "3px" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
