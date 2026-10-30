import React from "react";
import { Skeleton } from "@mui/material";

import * as sidebar from "features/dashboard/styles/sidebarClasses";
import { divider } from "shared/styles/sharedClasses";

const LinkSkeleton = () => (
  <div className="flex items-center py-1.5">
    <Skeleton variant="rounded" width={20} height={20} sx={{ my: "8px", mx: "6px", mr: "20px" }} />
    <Skeleton variant="text" width="60%" sx={{ fontSize: 18 }} />
  </div>
);

// Loading state of Sidebar and TeamSidebar. mainLinks is the number of links in the first group
// (personal: Dashboard, Your Work, Notes, Notifications; team adds Add Team Member)
const SidebarSkeleton = ({ mainLinks }: { mainLinks: number }) => {
  return (
    <div className={sidebar.container}>
      <div className={sidebar.sidebar}>
        <div className={sidebar.contents}>
          <div className={sidebar.projectName}>
            <Skeleton variant="circular" width={30} height={30} sx={{ mr: "15px" }} />
            <div className="flex-1">
              <Skeleton variant="text" width="70%" sx={{ fontSize: 16 }} />
              <Skeleton variant="text" width="50%" sx={{ fontSize: 13 }} />
            </div>
          </div>
          <div className={divider} />
          <div className={sidebar.linkContainer}>
            {Array.from({ length: mainLinks }, (_, index) => (
              <LinkSkeleton key={index} />
            ))}
          </div>
          <div className={divider} />
          {/* Project Setting */}
          <div className={sidebar.linkContainer}>
            <LinkSkeleton />
          </div>
          <div className={divider} />
          {/* Trash */}
          <LinkSkeleton />
          <div className={divider} />
        </div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;
