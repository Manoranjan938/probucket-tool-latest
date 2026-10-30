import DashboardHeader from "features/dashboard/components/DashboardHeader/DashboardHeader";
import TeamSidebar from "features/dashboard/components/TeamSidebar/TeamSidebar";
import React from "react";
import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";


const TeamDashboard = ({ children }: PropsWithChildren) => {
  
  let { search } = useLocation();

  const query = new URLSearchParams(search);
  const param = query.get("project");
  const name = query.get("name");

  return (
    <>
      <div>
        <div>
          <DashboardHeader />
          <TeamSidebar id={param} name={name} />
        </div>
        <div className="h-full ml-[310px] pt-[100px]">{children}</div>
      </div>
    </>
  );
};

export default TeamDashboard;
