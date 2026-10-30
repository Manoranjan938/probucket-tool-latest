import React from "react";
import { Skeleton } from "@mui/material";

// Shown while the 404 page's code is loading (same layout as Error.tsx)
const ErrorSkeleton = () => {
  return (
    <div
      className="flex flex-col min-h-screen py-8 px-12 bg-brand-surface [&_*]:box-border max-[480px]:py-6 max-[480px]:px-4"
      aria-busy="true"
    >
      <header className="inline-flex items-center gap-2">
        <Skeleton variant="circular" width={34} height={34} />
        <Skeleton variant="text" width={110} sx={{ fontSize: 22 }} />
      </header>

      <main className="flex flex-col items-center w-full max-w-[560px] m-auto py-8">
        {/* error-page.png is 1030×672 */}
        <Skeleton variant="rounded" width="100%" sx={{ maxWidth: 360, aspectRatio: "1030 / 672", height: "auto", mb: "24px" }} />
        <Skeleton variant="text" width={90} sx={{ fontSize: 13, mb: "12px" }} />
        <Skeleton variant="text" width="65%" sx={{ fontSize: 44, lineHeight: 1.1, mb: "12px" }} />
        <Skeleton variant="text" width="85%" sx={{ fontSize: 17 }} />
        <Skeleton variant="text" width="60%" sx={{ fontSize: 17 }} />
        <div className="flex justify-center gap-3 mt-8 max-[480px]:flex-col max-[480px]:self-stretch">
          <Skeleton variant="rounded" width={140} height={44} sx={{ borderRadius: "10px", maxWidth: "100%" }} />
          <Skeleton variant="rounded" width={120} height={44} sx={{ borderRadius: "10px", maxWidth: "100%" }} />
        </div>
      </main>
    </div>
  );
};

export default ErrorSkeleton;
