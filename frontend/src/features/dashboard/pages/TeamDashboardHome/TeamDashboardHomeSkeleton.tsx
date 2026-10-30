import React from "react";

import TeamTaskCardsSkeleton from "features/dashboard/components/TeamTaskCards/TeamTaskCardsSkeleton";

// Shown in the dashboard content area while the team dashboard home page's code is loading
// (the cards only – the "no team members" banner depends on fetched data)
const TeamDashboardHomeSkeleton = () => {
  return (
    <div aria-busy="true">
      <TeamTaskCardsSkeleton />
    </div>
  );
};

export default TeamDashboardHomeSkeleton;
