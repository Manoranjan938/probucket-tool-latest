import React from "react";
import { Skeleton } from "@mui/material";

import * as auth from "features/auth/styles/authClasses";
import {
  AuthBrandSkeleton,
  AuthFooterSkeleton,
} from "features/auth/components/AuthSkeleton/AuthSkeleton";

// Shown while the Verify email page's code is loading
const EmailVerifySkeleton = () => {
  return (
    <div className={auth.layoutSingle} aria-busy="true">
      <div className={auth.main}>
        <AuthBrandSkeleton />

        <div className={auth.contentSingle}>
          <div className={auth.card}>
            <Skeleton variant="circular" width={72} height={72} sx={{ mx: "auto", mb: "24px" }} />
            <Skeleton variant="text" width="65%" sx={{ fontSize: 32, lineHeight: 1.2, mx: "auto", mb: "8px" }} />
            <Skeleton variant="text" width="100%" sx={{ fontSize: 16 }} />
            <Skeleton variant="text" width="70%" sx={{ fontSize: 16, mx: "auto", mb: "32px" }} />
            <AuthFooterSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerifySkeleton;
