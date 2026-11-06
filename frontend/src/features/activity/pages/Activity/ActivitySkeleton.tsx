import React from "react";
import { Skeleton } from "@mui/material";

import * as styles from "features/activity/styles/activityClasses";

import TimelineSkeleton from "features/activity/components/Timeline/TimelineSkeleton";

// Shown in the dashboard content area while the Activity page's code is loading
const ActivitySkeleton = ({ team = false }: { team?: boolean }) => {
  return (
    <div className={styles.page} aria-busy="true">
      <Skeleton variant="text" width={320} sx={{ fontSize: 15, maxWidth: "100%" }} />
      <div className={styles.pageCard}>
        <div className={styles.filters}>
          <div className={styles.filterRow}>
            {(team ? [150, 170, 140] : [170, 140]).map((width) => (
              <Skeleton key={width} variant="rounded" width={width} height={36} sx={{ borderRadius: "999px" }} />
            ))}
          </div>
        </div>
        <TimelineSkeleton />
      </div>
    </div>
  );
};

export default ActivitySkeleton;
