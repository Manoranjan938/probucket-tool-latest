import React from "react";
import { Skeleton } from "@mui/material";

import * as styles from "features/activity/styles/activityClasses";

// Loading state of a Timeline
const TimelineSkeleton = () => {
  return (
    <div aria-busy="true">
      <Skeleton variant="text" width={70} sx={{ fontSize: 12, mb: "12px" }} />
      <div className={styles.list}>
        {[0, 1, 2].map((item) => (
          <div key={item} className={styles.entry}>
            <Skeleton variant="circular" width={32} height={32} sx={{ flexShrink: 0 }} />
            <div className={styles.body}>
              <Skeleton variant="text" sx={{ fontSize: 14 }} />
              <Skeleton variant="text" width="60%" sx={{ fontSize: 13 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineSkeleton;
