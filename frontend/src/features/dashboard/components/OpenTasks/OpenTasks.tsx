import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiInbox } from "react-icons/fi";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import TaskRow from "features/dashboard/components/TaskRow/TaskRow";
import TaskRowsSkeleton from "features/dashboard/components/TaskRow/TaskRowsSkeleton";
import type { TaskListItem } from "features/tasks/types";

const MAX_TASKS = 6;

interface OpenTasksProps {
  /** undefined while loading */
  tasks: TaskListItem[] | undefined;
  /** The project's Your work page */
  worksLink: string;
}

// Tasks that aren't completed yet. The backend sorts the list by priority and sends no dates,
// so this shows the first few open tasks rather than the most recent ones.
const OpenTasks = ({ tasks, worksLink }: OpenTasksProps) => {
  const allTasks = tasks ?? [];
  const openTasks = allTasks.filter((task) => task.status !== "COMPLETED");

  return (
    <section className={dashboard.card} aria-labelledby="open-tasks-title">
      <div className={dashboard.cardHeader}>
        <h2 id="open-tasks-title" className={dashboard.cardTitle}>Open tasks</h2>
        <Link to={worksLink} className={dashboard.cardLink}>View all</Link>
      </div>

      {tasks === undefined ? (
        <TaskRowsSkeleton />
      ) : openTasks.length > 0 ? (
        <ul className={dashboard.taskList}>
          {openTasks.slice(0, MAX_TASKS).map((task) => (
            <TaskRow key={task.taskSequence} task={task} />
          ))}
        </ul>
      ) : allTasks.length > 0 ? (
        <div className={dashboard.emptyCard}>
          <span className={dashboard.emptyIcon} aria-hidden="true"><FiCheckCircle /></span>
          <p className={dashboard.emptyTitle}>All caught up</p>
          <p className={dashboard.emptyText}>Every task in this project is completed.</p>
        </div>
      ) : (
        <div className={dashboard.emptyCard}>
          <span className={dashboard.emptyIcon} aria-hidden="true"><FiInbox /></span>
          <p className={dashboard.emptyTitle}>No tasks yet</p>
          <p className={dashboard.emptyText}>Create your first task on the board.</p>
          <Link to={worksLink} className={dashboard.btnPrimary}>Go to Your work</Link>
        </div>
      )}
    </section>
  );
};

export default OpenTasks;
