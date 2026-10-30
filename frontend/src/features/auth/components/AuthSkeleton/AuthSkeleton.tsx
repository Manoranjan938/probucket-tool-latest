import React from "react";
import { Skeleton } from "@mui/material";

import * as auth from "features/auth/styles/authClasses";

// Building blocks for the auth page skeletons (LoginSkeleton, SignupSkeleton, …).
// The wrappers reuse authClasses, so every block has the same size and spacing as the real page.

// Logo + "ProBucket" at the top left
export const AuthBrandSkeleton = () => (
  <div className={auth.brand}>
    <Skeleton variant="circular" width={34} height={34} />
    <Skeleton variant="text" width={110} sx={{ fontSize: 22 }} />
  </div>
);

// Title + one-line subtitle
export const AuthHeadingSkeleton = ({ centered = false }: { centered?: boolean }) => (
  <>
    <Skeleton
      variant="text"
      width="75%"
      sx={{ fontSize: 32, lineHeight: 1.2, mb: "8px", mx: centered ? "auto" : 0 }}
    />
    <Skeleton
      variant="text"
      width="90%"
      sx={{ fontSize: 16, mb: "32px", mx: centered ? "auto" : 0 }}
    />
  </>
);

// Label (and the optional link next to it, e.g. "Can't login?") above an input
export const AuthFieldSkeleton = ({ withLink = false }: { withLink?: boolean }) => (
  <div className={auth.field}>
    <div className={auth.labelRow}>
      <Skeleton variant="text" width={80} sx={{ fontSize: 14 }} />
      {withLink && <Skeleton variant="text" width={90} sx={{ fontSize: 14 }} />}
    </div>
    <Skeleton variant="rounded" height={46} sx={{ borderRadius: "10px" }} />
  </div>
);

// Full-width button; mt matches btnPrimary (28px) / btnGhost (12px) / btnGoogle (0)
export const AuthButtonSkeleton = ({ mt = 0 }: { mt?: number }) => (
  <Skeleton variant="rounded" height={46} sx={{ mt: `${mt}px`, borderRadius: "10px" }} />
);

// The "or" line between the form and the Google button
export const AuthDividerSkeleton = () => (
  <Skeleton variant="text" sx={{ fontSize: 13, my: "24px" }} />
);

// Centered link under the form
export const AuthFooterSkeleton = () => (
  <div className={auth.footer}>
    <Skeleton variant="text" width={170} sx={{ fontSize: 14, mx: "auto" }} />
  </div>
);
