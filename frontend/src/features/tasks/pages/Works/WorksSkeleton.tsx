import React from "react";
import { Skeleton } from "@mui/material";

import * as task from "features/tasks/styles/taskClasses";

// The three board columns with placeholder cards – also shown by the Works page while the tasks load
export const BoardSkeleton = () => {
  return (
    <div className={task.board} aria-busy="true">
      {[2, 1, 1].map((cards, index) => (
        <div key={index} className={task.column}>
          <div className={task.columnHeader}>
            <Skeleton variant="circular" width={10} height={10} />
            <Skeleton variant="text" width={90} sx={{ fontSize: 14 }} />
          </div>
          {Array.from({ length: cards }, (_, card) => (
            <div key={card} className={`${task.card} cursor-default!`}>
              <Skeleton variant="text" width="85%" sx={{ fontSize: 14 }} />
              <Skeleton variant="text" width="45%" sx={{ fontSize: 12 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Shown in the dashboard content area while the Works page's code is loading: toolbar and board.
// The team board's toolbar also has a search box and member avatars.
const WorksSkeleton = ({ team = false }: { team?: boolean }) => {
  return (
    <div className={task.page} aria-busy="true">
      <div className={task.toolbar}>
        <div className={task.toolbarStart}>
          {team ? (
            <>
              <Skeleton variant="rounded" width={240} height={40} sx={{ borderRadius: "10px" }} />
              <div className="flex -space-x-2">
                {[0, 1, 2].map((item) => (
                  <Skeleton key={item} variant="circular" width={32} height={32} sx={{ border: "2px solid #f8f8fc" }} />
                ))}
              </div>
            </>
          ) : (
            <Skeleton variant="text" width={60} sx={{ fontSize: 15 }} />
          )}
        </div>
        <Skeleton variant="rounded" width={120} height={40} sx={{ borderRadius: "10px" }} />
      </div>
      <BoardSkeleton />
    </div>
  );
};

export default WorksSkeleton;
