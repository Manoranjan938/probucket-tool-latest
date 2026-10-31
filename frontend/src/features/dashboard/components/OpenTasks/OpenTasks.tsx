import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "@mui/material";
import { FiCheckCircle, FiFlag, FiInbox } from "react-icons/fi";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import useGetTaskLists from "features/tasks/hooks/useGetTaskLists";
import { priorityColors, taskStatuses } from "features/tasks/data";

const MAX_TASKS = 6;

interface OpenTasksProps {
  /** projectIdentifier – the "name" query parameter */
  name: string | null;
  /** The project's Your work page */
  worksLink: string;
}

// Tasks that aren't completed yet. The backend sorts the list by priority and sends no dates,
// so this shows the first few open tasks rather than the most recent ones.
const OpenTasks = ({ name, worksLink }: OpenTasksProps) => {
  const [tasks, getTaskLists] = useGetTaskLists();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // The backend answers 400 "Task not found" when the project has no tasks
    getTaskLists(name).catch(() => setFailed(true));
  }, [name]);

  const loading = tasks === undefined && !failed;
  const allTasks = tasks ?? [];
  const openTasks = allTasks.filter((task) => task.status !== "COMPLETED");

  return (
    <section className={dashboard.card} aria-labelledby="open-tasks-title">
      <div className={dashboard.cardHeader}>
        <h2 id="open-tasks-title" className={dashboard.cardTitle}>Open tasks</h2>
        <Link to={worksLink} className={dashboard.cardLink}>View all</Link>
      </div>

      {loading ? (
        <div aria-busy="true">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} variant="text" sx={{ fontSize: 15, my: "10px" }} />
          ))}
        </div>
      ) : openTasks.length > 0 ? (
        <ul className={dashboard.taskList}>
          {openTasks.slice(0, MAX_TASKS).map((task) => {
            const status = taskStatuses[task.status] ?? taskStatuses.TODO;
            return (
              <li key={task.taskSequence} className={dashboard.taskRow}>
                <span className={dashboard.taskKey}>{task.taskSequence}</span>
                <span className={dashboard.taskName} title={task.taskName}>{task.taskName}</span>
                {task.priority ? (
                  <FiFlag
                    className={`${dashboard.priorityIcon} ${priorityColors[task.priority] ?? priorityColors.LOW}`}
                    aria-label={`${task.priority.toLowerCase()} priority`}
                  />
                ) : null}
                <span className={`${dashboard.statusPill} ${status.soft} ${status.text}`}>{status.label}</span>
              </li>
            );
          })}
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
