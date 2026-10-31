import React, { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import TaskStats from "features/dashboard/components/TaskStats/TaskStats";
import TaskStatsSkeleton from "features/dashboard/components/TaskStats/TaskStatsSkeleton";
import TaskProgress from "features/dashboard/components/TaskProgress/TaskProgress";
import OpenTasks from "features/dashboard/components/OpenTasks/OpenTasks";
import useGetHomeCountDatas from "features/dashboard/hooks/useGetHomeCountDatas";
import { dashboardLink, type DashboardType } from "features/dashboard/data";
import type { RootState } from "app/store";

type OwnProps = PropsWithChildren<{ type: DashboardType }>;

// Content of the personal and team dashboard home pages. children is shown below the task counts.
const HomeOverview = ({ type, children, currentUser, currentProject }: OwnProps & Props) => {
  const { search } = useLocation();
  const [counts, getHomeCountData] = useGetHomeCountDatas();
  const [countsFailed, setCountsFailed] = useState(false);

  const query = new URLSearchParams(search);
  const projectId = query.get("project");
  const name = query.get("name");

  useEffect(() => {
    getHomeCountData(projectId).catch((err) => {
      console.log(err);
      setCountsFailed(true);
    });
  }, [projectId]);

  const countsLoaded = counts.total !== undefined || countsFailed;
  const firstName = currentUser.fullName?.split(" ")[0];
  // The sidebar loads the project; until then (or while it still holds the previous project) no name is shown
  const projectName = currentProject.projectId === projectId ? currentProject.projectName : undefined;

  return (
    <div className={dashboard.home}>
      <div>
        <h2 className={dashboard.greeting}>Welcome back{firstName ? `, ${firstName}` : ""}</h2>
        <p className={dashboard.greetingText}>
          Here's how{" "}
          {projectName ? <span className={dashboard.greetingProject}>{projectName}</span> : "your project"} is
          going.
        </p>
      </div>

      {countsLoaded ? <TaskStats counts={counts} /> : <TaskStatsSkeleton />}

      {children}

      <div className={dashboard.homeGrid}>
        <OpenTasks name={name} worksLink={dashboardLink(type, "works", projectId, name)} />
        <TaskProgress counts={counts} />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentUser: state.security.user,
  currentProject: state.project.project,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(HomeOverview);
