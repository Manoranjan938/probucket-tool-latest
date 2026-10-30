import Notification from "features/notifications/components/Notification/Notification";
import React from "react";
import Helmet from "react-helmet";

const Notifications = ({ title }) => {
  return (
    <>
      <Helmet>
        <title>{title} | Notification</title>
      </Helmet>
      <Notification />
    </>
  );
};

export default Notifications;
