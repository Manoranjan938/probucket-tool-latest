import React from "react";
import { FiCheckCircle, FiCircle, FiClock, FiLayers } from "react-icons/fi";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import type { HomeTaskCounts } from "features/dashboard/types";

// pending counts the TODO tasks (ProjectTaskRepository.getPendingTaskByProject)
const stats = [
  { key: "total", label: "Total tasks", icon: FiLayers, colors: "bg-brand-soft text-brand-strong" },
  { key: "completed", label: "Completed", icon: FiCheckCircle, colors: "bg-status-done-soft text-status-done" },
  { key: "inprogress", label: "In progress", icon: FiClock, colors: "bg-status-progress-soft text-status-progress" },
  { key: "pending", label: "To do", icon: FiCircle, colors: "bg-status-todo-soft text-status-todo" },
] as const;

// The project's task counts on the dashboard home page; a dash is shown when they couldn't be loaded
const TaskStats = ({ counts }: { counts: Partial<HomeTaskCounts> }) => {
  return (
    <div className={dashboard.statGrid}>
      {stats.map((stat) => (
        <div key={stat.key} className={dashboard.statCard}>
          <span className={`${dashboard.statIcon} ${stat.colors}`} aria-hidden="true">
            <stat.icon />
          </span>
          <div>
            <p className={dashboard.statValue}>{counts[stat.key] ?? "–"}</p>
            <p className={dashboard.statLabel}>{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;
