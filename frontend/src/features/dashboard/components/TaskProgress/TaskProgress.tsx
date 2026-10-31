import React from "react";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import { taskStatuses } from "features/tasks/data";
import type { HomeTaskCounts } from "features/dashboard/types";

// Share of completed tasks, with a bar split by status
const TaskProgress = ({ counts }: { counts: Partial<HomeTaskCounts> }) => {
  const total = counts.total ?? 0;
  const parts = [
    { status: taskStatuses.COMPLETED, value: counts.completed ?? 0 },
    { status: taskStatuses.INPROGRESS, value: counts.inprogress ?? 0 },
    { status: taskStatuses.TODO, value: counts.pending ?? 0 },
  ];
  const percent = total > 0 ? Math.round(((counts.completed ?? 0) / total) * 100) : 0;

  return (
    <section className={dashboard.card} aria-labelledby="task-progress-title">
      <div className={dashboard.cardHeader}>
        <h2 id="task-progress-title" className={dashboard.cardTitle}>Progress</h2>
      </div>
      <p className={dashboard.progressValue}>{percent}%</p>
      <p className={dashboard.progressCaption}>
        {total > 0 ? "of tasks completed" : "No tasks yet"}
      </p>

      <div
        className={dashboard.progressBar}
        role="progressbar"
        aria-label="Tasks completed"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        {total > 0
          ? parts.map((part) => (
              <span
                key={part.status.label}
                className={part.status.solid}
                style={{ width: `${(part.value / total) * 100}%` }}
              />
            ))
          : null}
      </div>

      <ul className={dashboard.legend}>
        {parts.map((part) => (
          <li key={part.status.label} className={dashboard.legendItem}>
            <span className={`${dashboard.legendDot} ${part.status.solid}`} aria-hidden="true" />
            {part.status.label}
            <span className={dashboard.legendValue}>{part.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TaskProgress;
