import React from "react";
import type { PropsWithChildren } from "react";

import DashboardLayout from "features/dashboard/components/DashboardLayout/DashboardLayout";

// Team dashboard (/project/team/*); children is the current page
const TeamDashboard = ({ children }: PropsWithChildren) => {
  return <DashboardLayout type="team">{children}</DashboardLayout>;
};

export default TeamDashboard;
