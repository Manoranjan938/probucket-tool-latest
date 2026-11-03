import React from "react";
import { Skeleton } from "@mui/material";

import * as profile from "features/profile/styles/profileClasses";

import ProjectsTopBarSkeleton from "features/projects/components/ProjectsTopBar/ProjectsTopBarSkeleton";

const CardSkeleton = ({ height }: { height: number }) => (
  <div className={profile.card}>
    <div className={profile.cardHeader}>
      <div className="flex-1">
        <Skeleton variant="text" width={150} sx={{ fontSize: 16 }} />
        <Skeleton variant="text" width="50%" sx={{ fontSize: 14 }} />
      </div>
    </div>
    <div className={profile.cardBody}>
      <Skeleton variant="rounded" height={height} sx={{ borderRadius: "10px" }} />
    </div>
  </div>
);

// Shown while the Profile page's code is loading
const UserProfileSkeleton = () => {
  return (
    <div className={profile.page} aria-busy="true">
      <ProjectsTopBarSkeleton />
      <div className={profile.container}>
        <Skeleton variant="text" width={110} sx={{ fontSize: 14, mb: "16px" }} />
        <div className={profile.header}>
          <Skeleton variant="circular" width={64} height={64} className="shrink-0" />
          <div className="flex-1">
            <Skeleton variant="text" width={200} sx={{ fontSize: 24 }} />
            <Skeleton variant="text" width={240} sx={{ fontSize: 15, maxWidth: "100%" }} />
          </div>
        </div>
        <div className={profile.tabs}>
          <Skeleton variant="rounded" width={74} height={36} sx={{ borderRadius: "8px" }} />
          <Skeleton variant="rounded" width={82} height={36} sx={{ borderRadius: "8px" }} />
        </div>
        <div className={profile.panel}>
          <CardSkeleton height={160} />
          <CardSkeleton height={56} />
        </div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
