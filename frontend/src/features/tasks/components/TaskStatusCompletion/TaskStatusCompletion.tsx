import React, { useEffect } from "react";

import * as task from "features/tasks/styles/taskClasses";

import useGetTaskStatistics from "features/tasks/hooks/useGetTaskStatistics";
import { taskStatuses } from "features/tasks/data";
import type { TaskDetails } from "features/tasks/types";

// Share of the task's subtasks per status. The backend sends percentages (0 when there are no subtasks).
const TaskStatusCompletion = ({ task: currentTask }: { task: Partial<TaskDetails> }) => {
  const [stats, getTaskStats] = useGetTaskStatistics();

  // Again after the task is reloaded, e.g. when a subtask was added
  useEffect(() => {
    getTaskStats(currentTask.taskSequence).catch((err) => console.log(err));
  }, [currentTask]);

  const rows = [
    { status: taskStatuses.COMPLETED, value: stats.completed ?? 0 },
    { status: taskStatuses.INPROGRESS, value: stats.inprogress ?? 0 },
    { status: taskStatuses.TODO, value: stats.pending ?? 0 },
  ];
  const hasSubtasks = rows.some((row) => row.value > 0);

  return (
    <div className={task.sideCard}>
      <h3 className={task.sideCardTitle}>Subtask progress</h3>
      {hasSubtasks ? (
        rows.map((row) => (
          <div key={row.status.label} className={task.progressRow}>
            <span className={task.progressLabel}>{row.status.label}</span>
            <span className={task.progressTrack}>
              <span className={`block h-full rounded-full ${row.status.solid}`} style={{ width: `${row.value}%` }} />
            </span>
            <span className={task.progressValue}>{Math.round(row.value)}%</span>
          </div>
        ))
      ) : (
        <p className="text-[14px] text-brand-muted">Add subtasks to track progress here.</p>
      )}
    </div>
  );
};

export default TaskStatusCompletion;
