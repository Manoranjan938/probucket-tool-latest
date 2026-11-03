import React from "react";
import { FiFlag } from "react-icons/fi";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import BarRow from "features/dashboard/components/BarRow/BarRow";
import BarRowsSkeleton from "features/dashboard/components/BarRow/BarRowsSkeleton";
import { formatEnum, priorities, priorityColors } from "features/tasks/data";
import type { TaskListItem } from "features/tasks/types";

// Open tasks per priority, highest first. Tasks without a priority count as low, like their flag on the board.
const PriorityBreakdown = ({ tasks }: { tasks: TaskListItem[] | undefined }) => {
  const openTasks = (tasks ?? []).filter((task) => task.status !== "COMPLETED");
  const countOf = (priority: string) =>
    openTasks.filter((task) => (priorityColors[task.priority] ? task.priority : "LOW") === priority).length;

  return (
    <section className={dashboard.card} aria-labelledby="priority-title">
      <div className={dashboard.cardHeader}>
        <h2 id="priority-title" className={dashboard.cardTitle}>Open by priority</h2>
      </div>

      {tasks === undefined ? (
        <BarRowsSkeleton />
      ) : openTasks.length > 0 ? (
        <ul className={dashboard.barList}>
          {[...priorities].reverse().map((priority) => {
            const count = countOf(priority);
            const percent = Math.round((count / openTasks.length) * 100);
            return (
              <BarRow
                key={priority}
                label={
                  <>
                    <FiFlag className={priorityColors[priority]} aria-hidden="true" />
                    {formatEnum(priority)}
                  </>
                }
                value={count}
                percent={percent}
                tooltip={`${count} of ${openTasks.length} open tasks (${percent}%)`}
              />
            );
          })}
        </ul>
      ) : (
        <p className={dashboard.cardEmptyText}>No open tasks.</p>
      )}
    </section>
  );
};

export default PriorityBreakdown;
