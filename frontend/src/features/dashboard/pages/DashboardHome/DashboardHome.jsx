//import DashboardGraph from "features/dashboard/components/DashboardGraph/DashboardGraph";
import TeamTaskCards from "features/dashboard/components/TeamTaskCards/TeamTaskCards";
import React from "react";
import Helmet from "react-helmet";

const DashboardHome = ({ title }) => {
  return (
    <>
      <Helmet>
        <title>{title} | Home</title>
      </Helmet>
      {/* <DashboardGraph /> */}
      {/* <HomePersonalTask />
      <HomeSubTask /> */}
      <TeamTaskCards />
    </>
  );
};

export default DashboardHome;
