import React from "react";
import type { PropsWithChildren } from "react";

import DashboardLayout from "features/dashboard/components/DashboardLayout/DashboardLayout";

// Personal dashboard (/project/personal/*); children is the current page
const DashboardScreen = ({ children }: PropsWithChildren) => {
  return <DashboardLayout type="personal">{children}</DashboardLayout>;
};

export default DashboardScreen;
