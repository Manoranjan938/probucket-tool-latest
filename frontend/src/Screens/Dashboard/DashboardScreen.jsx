import DashboardHeader from "Components/DashboardHeader/DashboardHeader";
import Sidebar from "Components/Sidebar/Sidebar";
import React from "react";
import { useLocation } from "react-router-dom";

import "./DashboardScreen.css";

const DashboardScreen = ({ children }) => {
  let { search } = useLocation();

  const query = new URLSearchParams(search);
  const param = query.get("project");
  const name = query.get("name");

  return (
    <>
      <div className="sidebar__layout">
        <div className="const">
          <DashboardHeader />
          <Sidebar id={param} name={name} />
        </div>
        <div className="sidebar__main">{children}</div>
      </div>
    </>
  );
};

export default DashboardScreen;
