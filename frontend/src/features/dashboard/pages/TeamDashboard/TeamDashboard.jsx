import DashboardHeader from "Components/DashboardHeader/DashboardHeader";
import TeamSidebar from "Components/TeamSidebar/TeamSidebar";
import React from "react";
import { useLocation } from "react-router-dom";

import "./TeamDashboard.css";

const TeamDashboard = ({ children }) => {
  
  let { search } = useLocation();

  const query = new URLSearchParams(search);
  const param = query.get("project");
  const name = query.get("name");

  return (
    <>
      <div className="team_sidebar__layout">
        <div className="const">
          <DashboardHeader />
          <TeamSidebar id={param} name={name} />
        </div>
        <div className="team_sidebar__main">{children}</div>
      </div>
    </>
  );
};

export default TeamDashboard;
