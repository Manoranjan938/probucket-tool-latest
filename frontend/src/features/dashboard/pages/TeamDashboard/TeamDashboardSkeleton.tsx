import React from "react";
import type { PropsWithChildren } from "react";

import DashboardLayoutSkeleton from "features/dashboard/components/DashboardLayout/DashboardLayoutSkeleton";

// Shown while the team dashboard layout's code is loading; children is the current page's skeleton
// (5 links: team admins also get Team members)
const TeamDashboardSkeleton = ({ children }: PropsWithChildren) => {
  return <DashboardLayoutSkeleton mainLinks={5}>{children}</DashboardLayoutSkeleton>;
};

export default TeamDashboardSkeleton;
