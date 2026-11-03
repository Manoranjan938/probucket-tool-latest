import React from "react";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import TaskRow from "features/dashboard/components/TaskRow/TaskRow";
import TaskRowsSkeleton from "features/dashboard/components/TaskRow/TaskRowsSkeleton";
import type { TaskListItem } from "features/tasks/types";

const MAX_TASKS = 5;

interface AssignedToMeProps {
  /** undefined while loading */
  tasks: TaskListItem[] | undefined;
  userId: string | undefined;
  /** The project's Your work page */
  worksLink: string;
}

// Team dashboard home: the user's own open tasks, and how many open tasks have nobody assigned
const AssignedToMe = ({ tasks, userId, worksLink }: AssignedToMeProps) => {
  const openTasks = (tasks ?? []).filter((task) => task.status !== "COMPLETED");
  const myTasks = openTasks.filter((task) => task.assignee === userId);
  const unassigned = openTasks.filter((task) => !task.assignee).length;

  return (
    <section className={dashboard.card} aria-labelledby="assigned-title">
      <div className={dashboard.cardHeader}>
        <h2 id="assigned-title" className={dashboard.cardTitle}>Assigned to me</h2>
        <Link to={worksLink} className={dashboard.cardLink}>View all</Link>
      </div>

      {tasks === undefined ? (
        <TaskRowsSkeleton />
      ) : myTasks.length > 0 ? (
        <ul className={dashboard.taskList}>
          {myTasks.slice(0, MAX_TASKS).map((task) => (
            <TaskRow key={task.taskSequence} task={task} />
          ))}
        </ul>
      ) : (
        <div className={dashboard.emptyCardCompact}>
          <span className={dashboard.emptyIcon} aria-hidden="true"><FiUser /></span>
          <p className={dashboard.emptyTitle}>Nothing assigned to you</p>
        </div>
      )}

      {tasks !== undefined && unassigned > 0 ? (
        <p className={dashboard.cardNote}>
          {unassigned} open {unassigned === 1 ? "task has" : "tasks have"} nobody assigned.
        </p>
      ) : null}
    </section>
  );
};

export default AssignedToMe;
