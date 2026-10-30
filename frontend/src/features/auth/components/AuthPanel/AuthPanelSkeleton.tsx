import React from "react";
import { Skeleton } from "@mui/material";

import * as auth from "features/auth/styles/authClasses";

// Loading state of AuthPanel: title, text and the three feature rows
const AuthPanelSkeleton = () => {
  return (
    <aside className={auth.panel}>
      <div className={`${auth.panelInner} w-full`}>
        <Skeleton variant="text" width="95%" className={auth.panelSkeleton} sx={{ fontSize: 40, lineHeight: 1.1 }} />
        <Skeleton variant="text" width="70%" className={auth.panelSkeleton} sx={{ fontSize: 40, lineHeight: 1.1, mb: "16px" }} />
        <Skeleton variant="text" width="85%" className={auth.panelSkeleton} sx={{ fontSize: 17 }} />
        <ul className={auth.panelList}>
          {[0, 1, 2].map((item) => (
            <li key={item} className={auth.panelItem}>
              <Skeleton variant="rounded" width={44} height={44} className={`${auth.panelSkeleton} shrink-0 rounded-xl!`} />
              <div className="flex-1">
                <Skeleton variant="text" width="45%" className={auth.panelSkeleton} sx={{ fontSize: 16 }} />
                <Skeleton variant="text" width="95%" className={auth.panelSkeleton} sx={{ fontSize: 15 }} />
                <Skeleton variant="text" width="60%" className={auth.panelSkeleton} sx={{ fontSize: 15 }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default AuthPanelSkeleton;
