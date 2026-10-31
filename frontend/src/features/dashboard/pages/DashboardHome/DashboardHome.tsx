import React from "react";
import Helmet from "react-helmet";

import HomeOverview from "features/dashboard/components/HomeOverview/HomeOverview";

const DashboardHome = ({ title }: { title: string }) => {
  return (
    <>
      <Helmet>
        <title>{title} | Home</title>
      </Helmet>
      <HomeOverview type="personal" />
    </>
  );
};

export default DashboardHome;
