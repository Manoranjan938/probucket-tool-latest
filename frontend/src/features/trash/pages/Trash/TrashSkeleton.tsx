import React from "react";

import EmptyStateSkeleton from "shared/components/EmptyState/EmptyStateSkeleton";

// Shown in the dashboard content area while the Trash page's code is loading
const TrashSkeleton = () => {
  return <EmptyStateSkeleton />;
};

export default TrashSkeleton;
