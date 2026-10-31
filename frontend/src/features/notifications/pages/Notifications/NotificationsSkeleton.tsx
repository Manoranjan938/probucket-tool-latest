import React from "react";

import EmptyStateSkeleton from "shared/components/EmptyState/EmptyStateSkeleton";

// Shown in the dashboard content area while the Notifications page's code is loading
const NotificationsSkeleton = () => {
  return <EmptyStateSkeleton />;
};

export default NotificationsSkeleton;
