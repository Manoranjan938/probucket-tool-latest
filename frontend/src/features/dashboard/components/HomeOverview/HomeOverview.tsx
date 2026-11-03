import React, { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import TaskStats from "features/dashboard/components/TaskStats/TaskStats";
import TaskStatsSkeleton from "features/dashboard/components/TaskStats/TaskStatsSkeleton";
import TaskProgress from "features/dashboard/components/TaskProgress/TaskProgress";
import DueTasks from "features/dashboard/components/DueTasks/DueTasks";
import OpenTasks from "features/dashboard/components/OpenTasks/OpenTasks";
import AssignedToMe from "features/dashboard/components/AssignedToMe/AssignedToMe";
import RecentActivity from "features/dashboard/components/RecentActivity/RecentActivity";
import TeamWorkload from "features/dashboard/components/TeamWorkload/TeamWorkload";
import PriorityBreakdown from "features/dashboard/components/PriorityBreakdown/PriorityBreakdown";
import ProjectDetailsCard from "features/dashboard/components/ProjectDetailsCard/ProjectDetailsCard";
import useGetHomeCountDatas from "features/dashboard/hooks/useGetHomeCountDatas";
import useGetTaskLists from "features/tasks/hooks/useGetTaskLists";
import { dashboardLink, type DashboardType } from "features/dashboard/data";
import type { TaskListItem } from "features/tasks/types";
import type { TeamMember } from "features/team/types";
import type { RootState } from "app/store";

type OwnProps = PropsWithChildren<{
  type: DashboardType;
  /** Team dashboard only: undefined while loading, null if it couldn't be loaded */
  team?: TeamMember[] | null;
}>;

// Content of the personal and team dashboard home pages. children is shown below the task counts.
const HomeOverview = ({ type, team, children, currentUser, currentProject }: OwnProps & Props) => {
  const { search } = useLocation();
  const [counts, getHomeCountData] = useGetHomeCountDatas();
  const [countsFailed, setCountsFailed] = useState(false);
  const [, getTaskLists] = useGetTaskLists();
  const [tasks, setTasks] = useState<TaskListItem[]>();

  const query = new URLSearchParams(search);
  const projectId = query.get("project");
  const name = query.get("name");

  useEffect(() => {
    getHomeCountData(projectId).catch((err) => {
      console.log(err);
      setCountsFailed(true);
    });
  }, [projectId]);

  // Cleared on every project change, so a project with no tasks doesn't keep showing the previous project's
  useEffect(() => {
    let current = true;
    setTasks(undefined);
    getTaskLists(name)
      .then((resp) => {
        if (current) {
          setTasks(resp.data.data);
        }
      })
      // The backend answers 400 "Task not found" when the project has no tasks
      .catch(() => {
        if (current) {
          setTasks([]);
        }
      });
    return () => {
      current = false;
    };
  }, [name]);

  const countsLoaded = counts.total !== undefined || countsFailed;
  const firstName = currentUser.fullName?.split(" ")[0];
  // The sidebar loads the project; until then (or while it still holds the previous project) no name is shown
  const project = currentProject.projectId === projectId ? currentProject : undefined;
  const worksLink = dashboardLink(type, "works", projectId, name);

  return (
    <div className={dashboard.home}>
      <div>
        <h2 className={dashboard.greeting}>Welcome back{firstName ? `, ${firstName}` : ""}</h2>
        <p className={dashboard.greetingText}>
          Here's how{" "}
          {project?.projectName ? <span className={dashboard.greetingProject}>{project.projectName}</span> : "your project"} is
          going.
        </p>
      </div>

      {countsLoaded ? <TaskStats counts={counts} /> : <TaskStatsSkeleton />}

      {children}

      <div className={dashboard.homeGrid}>
        <div className={dashboard.homeColumn}>
          {type === "team" ? <AssignedToMe tasks={tasks} userId={currentUser.id} worksLink={worksLink} /> : null}
          <DueTasks tasks={tasks} worksLink={worksLink} />
          <OpenTasks tasks={tasks} worksLink={worksLink} />
          {type === "team" ? <TeamWorkload tasks={tasks} team={team === null ? [] : team} /> : null}
        </div>
        <div className={dashboard.homeColumn}>
          <TaskProgress counts={counts} />
          <PriorityBreakdown tasks={tasks} />
          <ProjectDetailsCard project={project} memberCount={team?.length} />
          <RecentActivity name={name} tasks={tasks} />
        </div>
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
