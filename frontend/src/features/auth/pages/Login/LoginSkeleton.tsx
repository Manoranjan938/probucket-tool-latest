import React from "react";

import * as auth from "features/auth/styles/authClasses";
import {
  AuthBrandSkeleton,
  AuthButtonSkeleton,
  AuthDividerSkeleton,
  AuthFieldSkeleton,
  AuthFooterSkeleton,
  AuthHeadingSkeleton,
} from "features/auth/components/AuthSkeleton/AuthSkeleton";
import AuthPanelSkeleton from "features/auth/components/AuthPanel/AuthPanelSkeleton";

// Shown while the Login page's code is loading
const LoginSkeleton = () => {
  return (
    <div className={auth.layout} aria-busy="true">
      <div className={auth.main}>
        <AuthBrandSkeleton />

        <div className={auth.content}>
          <AuthHeadingSkeleton />
          <AuthFieldSkeleton />
          <AuthFieldSkeleton withLink />
          <AuthButtonSkeleton mt={28} />
          <AuthDividerSkeleton />
          <AuthButtonSkeleton />
          <AuthFooterSkeleton />
        </div>
      </div>

      <AuthPanelSkeleton />
    </div>
  );
};

export default LoginSkeleton;
