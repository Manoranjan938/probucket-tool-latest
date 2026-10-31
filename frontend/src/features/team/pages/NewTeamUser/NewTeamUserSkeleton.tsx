import React from "react";
import { Skeleton } from "@mui/material";

import * as team from "features/team/styles/teamClasses";

// Placeholder rows of the members table – also shown by the page while the members load
export const MembersTableSkeleton = () => {
  return (
    <div className={team.tableCard} aria-busy="true">
      <div className={`${team.thead} h-11`} />
      <div className={team.tbody}>
        {[0, 1, 2].map((item) => (
          <div key={item} className={`${team.tr} flex items-center gap-6 px-5 py-3.5`}>
            <div className={`${team.member} flex-[2]`}>
              <Skeleton variant="circular" width={36} height={36} className="shrink-0" />
              <div className="flex-1">
                <Skeleton variant="text" width="50%" sx={{ fontSize: 15 }} />
                <Skeleton variant="text" width="70%" sx={{ fontSize: 13 }} />
              </div>
            </div>
            <span className="flex-1 max-[768px]:hidden">
              <Skeleton variant="text" width="60%" sx={{ fontSize: 14 }} />
            </span>
            <span className="flex-1 max-[768px]:hidden">
              <Skeleton variant="rounded" width={64} height={22} sx={{ borderRadius: "999px" }} />
            </span>
            <span className="flex-1 max-[768px]:hidden">
              <Skeleton variant="text" width="60%" sx={{ fontSize: 14 }} />
            </span>
            <Skeleton variant="rounded" width={68} height={32} sx={{ borderRadius: "10px" }} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Shown in the dashboard content area while the Team members page's code is loading
const NewTeamUserSkeleton = () => {
  return (
    <div className={team.page} aria-busy="true">
      <div className={team.header}>
        <Skeleton variant="text" width={90} sx={{ fontSize: 15 }} />
        <Skeleton variant="rounded" width={140} height={40} sx={{ borderRadius: "10px" }} />
      </div>
      <MembersTableSkeleton />
    </div>
  );
};

export default NewTeamUserSkeleton;
