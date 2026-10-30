import React from "react";

import TeamTaskCardsSkeleton from "features/dashboard/components/TeamTaskCards/TeamTaskCardsSkeleton";

// Shown in the dashboard content area while the personal dashboard home page's code is loading
const DashboardHomeSkeleton = () => {
  return (
    <div aria-busy="true">
      <TeamTaskCardsSkeleton />
    </div>
  );
};

export default DashboardHomeSkeleton;
