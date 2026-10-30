import React from "react";
import { Skeleton } from "@mui/material";

import * as auth from "features/auth/styles/authClasses";
import {
  AuthBrandSkeleton,
  AuthButtonSkeleton,
  AuthDividerSkeleton,
  AuthFieldSkeleton,
  AuthFooterSkeleton,
  AuthHeadingSkeleton,
} from "features/auth/components/AuthSkeleton/AuthSkeleton";

// Shown while the Signup page's code is loading
const SignupSkeleton = () => {
  return (
    <div className={auth.layout} aria-busy="true">
      <div className={auth.main}>
        <AuthBrandSkeleton />

        <div className={auth.content}>
          <AuthHeadingSkeleton />
          <AuthFieldSkeleton />
          <AuthFieldSkeleton />
          <AuthFieldSkeleton />
          <AuthButtonSkeleton mt={28} />
          <AuthDividerSkeleton />
          <AuthButtonSkeleton />
          <AuthFooterSkeleton />
        </div>
      </div>

      {/* Signup's own panel: eyebrow, title and the three numbered steps */}
      <aside className={auth.panel}>
        <div className={`${auth.panelInner} w-full`}>
          <Skeleton variant="text" width={110} className={auth.panelSkeleton} sx={{ fontSize: 13, mb: "12px" }} />
          <Skeleton variant="text" width="95%" className={auth.panelSkeleton} sx={{ fontSize: 40, lineHeight: 1.1 }} />
          <Skeleton variant="text" width="55%" className={auth.panelSkeleton} sx={{ fontSize: 40, lineHeight: 1.1, mb: "16px" }} />
          <ol className={auth.panelList}>
            {[0, 1, 2].map((item) => (
              <li key={item} className={auth.panelItem}>
                <Skeleton variant="rounded" width={44} height={44} className={`${auth.panelSkeleton} shrink-0 rounded-xl!`} />
                <div className="flex-1">
                  <Skeleton variant="text" width="50%" className={auth.panelSkeleton} sx={{ fontSize: 16 }} />
                  <Skeleton variant="text" width="90%" className={auth.panelSkeleton} sx={{ fontSize: 15 }} />
                  {/* The last two step descriptions wrap onto a second line */}
                  {item > 0 && (
                    <Skeleton variant="text" width="35%" className={auth.panelSkeleton} sx={{ fontSize: 15 }} />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
};

export default SignupSkeleton;
