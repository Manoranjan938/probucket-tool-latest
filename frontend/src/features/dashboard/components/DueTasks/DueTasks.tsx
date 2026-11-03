import React from "react";
import { Link } from "react-router-dom";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import TaskRow from "features/dashboard/components/TaskRow/TaskRow";
import TaskRowsSkeleton from "features/dashboard/components/TaskRow/TaskRowsSkeleton";
import DueBadge from "features/tasks/components/DueBadge/DueBadge";
import { DUE_SOON_DAYS, getDueState } from "features/tasks/data";
import type { TaskListItem } from "features/tasks/types";

const MAX_TASKS = 5;

interface DueTasksProps {
  /** undefined while loading */
  tasks: TaskListItem[] | undefined;
  /** The project's Your work page */
  worksLink: string;
}

// Open tasks that are overdue or due soon, the earliest first
const DueTasks = ({ tasks, worksLink }: DueTasksProps) => {
  const dueTasks = (tasks ?? [])
    .filter((task) => task.dueDate && task.status !== "COMPLETED" && getDueState(task.dueDate) !== "later")
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!));
  const overdue = dueTasks.filter((task) => getDueState(task.dueDate!) === "overdue").length;
  const upcoming = dueTasks.length - overdue;

  return (
    <section className={dashboard.card} aria-labelledby="due-tasks-title">
      <div className={dashboard.cardHeader}>
        <h2 id="due-tasks-title" className={dashboard.cardTitle}>Due soon</h2>
        <Link to={worksLink} className={dashboard.cardLink}>View all</Link>
      </div>

      {tasks === undefined ? (
        <TaskRowsSkeleton />
      ) : dueTasks.length > 0 ? (
        <>
          <ul className={dashboard.taskList}>
            {dueTasks.slice(0, MAX_TASKS).map((task) => (
              <TaskRow
                key={task.taskSequence}
                task={task}
                trailing={<DueBadge dueDate={task.dueDate!} status={task.status} />}
              />
            ))}
          </ul>
          <p className={dashboard.cardNote}>
            {overdue} overdue, {upcoming} due in the next {DUE_SOON_DAYS} days.
          </p>
        </>
      ) : (
        <p className={dashboard.cardEmptyText}>Nothing is overdue or due in the next {DUE_SOON_DAYS} days.</p>
      )}
    </section>
  );
};

export default DueTasks;
