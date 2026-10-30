//import DashboardGraph from "Components/DashboardGraph/DashboardGraph";
import TeamTaskCards from "Components/TeamTaskCards/TeamTaskCards";
import React from "react";
import Helmet from "react-helmet";

const DasboardHome = ({ title }) => {
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

export default DasboardHome;
