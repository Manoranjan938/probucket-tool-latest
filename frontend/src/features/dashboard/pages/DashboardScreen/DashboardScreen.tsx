import DashboardHeader from "features/dashboard/components/DashboardHeader/DashboardHeader";
import Sidebar from "features/dashboard/components/Sidebar/Sidebar";
import React from "react";
import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";


const DashboardScreen = ({ children }: PropsWithChildren) => {
  let { search } = useLocation();

  const query = new URLSearchParams(search);
  const param = query.get("project");
  const name = query.get("name");

  return (
    <>
      <div>
        <div>
          <DashboardHeader />
          <Sidebar id={param} name={name} />
        </div>
        <div className="pt-[100px] pl-[300px]">{children}</div>
      </div>
    </>
  );
};

export default DashboardScreen;
