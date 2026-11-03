import React from "react";
import { FiCornerDownRight, FiFlag } from "react-icons/fi";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import { priorityColors, taskStatuses } from "features/tasks/data";
import type { TaskListItem } from "features/tasks/types";

// One task in the dashboard's task lists
const TaskRow = ({ task }: { task: TaskListItem }) => {
  const status = taskStatuses[task.status] ?? taskStatuses.TODO;

  return (
    <li className={dashboard.taskRow}>
      <span className={dashboard.taskKey}>{task.taskSequence}</span>
      {task.subtask ? (
        <FiCornerDownRight
          className="shrink-0 text-[13px] text-brand-muted"
          title={`Subtask of ${task.parentTaskId}`}
          aria-label={`Subtask of ${task.parentTaskId}`}
        />
      ) : null}
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
};

export default TaskRow;
