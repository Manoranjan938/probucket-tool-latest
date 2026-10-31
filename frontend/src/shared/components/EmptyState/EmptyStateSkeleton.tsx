import React from "react";
import { Skeleton } from "@mui/material";

// Loading state of EmptyState
const EmptyStateSkeleton = () => {
  return (
    <div
      className="flex flex-col items-center max-w-[460px] mx-auto mt-[6vh] p-10 border border-brand-border rounded-2xl bg-brand-surface max-[480px]:px-5 max-[480px]:py-8"
      aria-busy="true"
    >
      <Skeleton variant="circular" width={64} height={64} sx={{ mb: "20px" }} />
      <Skeleton variant="text" width={200} sx={{ fontSize: 20, mb: "8px", maxWidth: "100%" }} />
      <Skeleton variant="text" width={320} sx={{ fontSize: 15, maxWidth: "100%" }} />
    </div>
  );
};

export default EmptyStateSkeleton;
