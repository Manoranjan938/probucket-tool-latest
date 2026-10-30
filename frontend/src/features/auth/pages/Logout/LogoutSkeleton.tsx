import React from "react";
import { Skeleton } from "@mui/material";

import * as auth from "features/auth/styles/authClasses";
import {
  AuthBrandSkeleton,
  AuthButtonSkeleton,
  AuthFooterSkeleton,
  AuthHeadingSkeleton,
} from "features/auth/components/AuthSkeleton/AuthSkeleton";

// Shown while the Logout page's code is loading
const LogoutSkeleton = () => {
  return (
    <div className={auth.layoutSingle} aria-busy="true">
      <div className={auth.main}>
        <AuthBrandSkeleton />

        <div className={auth.contentSingle}>
          <div className={auth.card}>
            <AuthHeadingSkeleton />

            {/* Signed-in user summary */}
            <div className={auth.user}>
              <Skeleton variant="circular" width={48} height={48} className="shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton variant="text" width="50%" sx={{ fontSize: 16 }} />
                <Skeleton variant="text" width="75%" sx={{ fontSize: 14 }} />
              </div>
            </div>

            <AuthButtonSkeleton mt={28} />
            <AuthButtonSkeleton mt={12} />
            <AuthFooterSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutSkeleton;
