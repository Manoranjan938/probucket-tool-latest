import React from "react";
import Helmet from "react-helmet";
import { FiBell } from "react-icons/fi";

import EmptyState from "shared/components/EmptyState/EmptyState";

// The backend's notification list endpoint isn't implemented yet (it returns nothing), so there is never anything to list
const Notifications = ({ title }: { title: string }) => {
  return (
    <>
      <Helmet>
        <title>{title} | Notification</title>
      </Helmet>
      <EmptyState
        icon={FiBell}
        title="No notifications yet"
        text="Updates about this project will show up here."
      />
    </>
  );
};

export default Notifications;
