import React from "react";

import * as auth from "features/auth/styles/authClasses";
import {
  AuthBrandSkeleton,
  AuthButtonSkeleton,
  AuthFieldSkeleton,
  AuthFooterSkeleton,
  AuthHeadingSkeleton,
} from "features/auth/components/AuthSkeleton/AuthSkeleton";
import AuthPanelSkeleton from "features/auth/components/AuthPanel/AuthPanelSkeleton";

// Shown while the Reset password page's code is loading
const ResetPasswordSkeleton = () => {
  return (
    <div className={auth.layout} aria-busy="true">
      <div className={auth.main}>
        <AuthBrandSkeleton />

        <div className={auth.content}>
          <AuthHeadingSkeleton />
          <AuthFieldSkeleton />
          <AuthButtonSkeleton mt={28} />
          <AuthFooterSkeleton />
        </div>
      </div>

      <AuthPanelSkeleton />
    </div>
  );
};

export default ResetPasswordSkeleton;
