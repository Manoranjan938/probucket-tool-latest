import React from "react";
import { FiAlertCircle, FiCalendar, FiClock } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import { dueStyles, formatDueDate, getDueState, type DueState } from "features/tasks/data";

const icons: Record<DueState, typeof FiClock> = {
  overdue: FiAlertCircle,
  today: FiClock,
  soon: FiClock,
  later: FiCalendar,
};

const labels: Record<DueState, (date: string) => string> = {
  overdue: (date) => `Overdue · ${date}`,
  today: () => "Due today",
  soon: (date) => `Due ${date}`,
  later: (date) => `Due ${date}`,
};

interface DueBadgeProps {
  /** yyyy-mm-dd */
  dueDate: string;
  /** A completed task is never overdue */
  status?: string;
}

// A task's due date. The label says what the colour means, so it never relies on colour alone.
const DueBadge = ({ dueDate, status }: DueBadgeProps) => {
  const state = getDueState(dueDate, status);
  const Icon = icons[state];

  return (
    <span className={`${task.dueBadge} ${dueStyles[state]}`}>
      <Icon aria-hidden="true" />
      {labels[state](formatDueDate(dueDate))}
    </span>
  );
};

export default DueBadge;
