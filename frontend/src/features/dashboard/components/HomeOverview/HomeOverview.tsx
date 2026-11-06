import React, { useState } from "react";
import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

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
import NewTask from "features/tasks/components/NewTask/NewTask";
import useTaskNoun from "features/tasks/hooks/useTaskNoun";
import { useGetHomeTaskCountsQuery } from "features/dashboard/api/dashboardApi";
import { useGetTasksQuery } from "features/tasks/api/tasksApi";
import useCurrentProject from "features/projects/hooks/useCurrentProject";
import { dashboardLink, type DashboardType } from "features/dashboard/data";
import type { HomeTaskCounts } from "features/dashboard/types";
import type { TeamMember } from "features/team/types";
import { useAppSelector } from "app/hooks";

type Props = PropsWithChildren<{
  type: DashboardType;
  /** Team dashboard only: undefined while loading, null if it couldn't be loaded */
  team?: TeamMember[] | null;
}>;

// Content of the personal and team dashboard home pages. children is shown below the task counts.
const HomeOverview = ({ type, team, children }: Props) => {
  const currentUser = useAppSelector((state) => state.security.user);
  const { search } = useLocation();
  const [showNewTask, setShowNewTask] = useState(false);
  const noun = useTaskNoun();
  const query = new URLSearchParams(search);
  const projectId = query.get("project");
  const name = query.get("name");

  // The previous project's counts stay until the new ones arrive
  const { data: countsData, isError: countsFailed } = useGetHomeTaskCountsQuery(projectId);
  const counts: Partial<HomeTaskCounts> = countsData ?? {};
  // Cleared on every project change, so a project with no tasks doesn't keep showing the previous project's
  const { currentData: loadedTasks, isError: tasksFailed } = useGetTasksQuery(name);
  const tasks = tasksFailed ? [] : loadedTasks;
  // Undefined while this project's details are loading, so no name is shown
  const { currentData: project } = useCurrentProject();

  const countsLoaded = counts.total !== undefined || countsFailed;
  const firstName = currentUser.fullName?.split(" ")[0];
  const worksLink = dashboardLink(type, "works", projectId, name);

  return (
    <div className={dashboard.home}>
      <div className={dashboard.homeHeader}>
        <div>
          <h2 className={dashboard.greeting}>Welcome back{firstName ? `, ${firstName}` : ""}</h2>
          <p className={dashboard.greetingText}>
            Here's how{" "}
            {project?.projectName ? <span className={dashboard.greetingProject}>{project.projectName}</span> : "your project"} is
            going.
          </p>
        </div>
        <button type="button" className={dashboard.btnPrimary} onClick={() => setShowNewTask(true)}>
          <FiPlus aria-hidden="true" />
          New {noun}
        </button>
      </div>

      {countsLoaded ? <TaskStats counts={counts} /> : <TaskStatsSkeleton />}

      {children}

      <div className={dashboard.homeGrid}>
        <div className={dashboard.homeColumn}>
          {type === "team" ? <AssignedToMe tasks={tasks} userId={currentUser.id} worksLink={worksLink} /> : null}
          <DueTasks tasks={tasks} worksLink={worksLink} />
          <OpenTasks tasks={tasks} worksLink={worksLink} onNewTask={() => setShowNewTask(true)} />
          {type === "team" ? <TeamWorkload tasks={tasks} team={team === null ? [] : team} /> : null}
        </div>
        <div className={dashboard.homeColumn}>
          <TaskProgress counts={counts} />
          <PriorityBreakdown tasks={tasks} />
          <ProjectDetailsCard project={project} memberCount={team?.length} />
          <RecentActivity name={name} tasks={tasks} />
        </div>
      </div>

      {/* The same dialog as on the board; the cards above reload once the task is created */}
      <NewTask open={showNewTask} onClose={() => setShowNewTask(false)} projectIdentifier={name} />
    </div>
  );
};

export default HomeOverview;
