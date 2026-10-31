import React from "react";
import type { PropsWithChildren } from "react";

import DashboardLayoutSkeleton from "features/dashboard/components/DashboardLayout/DashboardLayoutSkeleton";

// Shown while the personal dashboard layout's code is loading; children is the current page's skeleton
const DashboardScreenSkeleton = ({ children }: PropsWithChildren) => {
  return <DashboardLayoutSkeleton mainLinks={4}>{children}</DashboardLayoutSkeleton>;
};

export default DashboardScreenSkeleton;
