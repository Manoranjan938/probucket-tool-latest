import React from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";

import * as task from "features/tasks/styles/taskClasses";

import ActivityList from "features/activity/components/ActivityList/ActivityList";
import TimelineSkeleton from "features/activity/components/Timeline/TimelineSkeleton";
import { useGetTaskActivityQuery } from "features/activity/api/activityApi";
import { useAppSelector } from "app/hooks";

// Everything recorded about the open task, the latest first
const TaskHistory = () => {
  const sequence = useAppSelector((state) => state.tasks.selectedTaskSequence);
  // Reloads after every change to a task or a new comment
  const { currentData, isError } = useGetTaskActivityQuery(sequence ?? skipToken);
  // undefined while loading, null if it couldn't be loaded
  const activities = isError ? null : currentData;

  if (activities === undefined) {
    return <TimelineSkeleton />;
  }
  if (activities === null) {
    return <p className={task.error}>Couldn't load the history. Please try again.</p>;
  }
  if (activities.length === 0) {
    return <p className="text-[14px] text-brand-muted">No history yet. New changes to this task will appear here.</p>;
  }
  return <ActivityList activities={activities} withinTask />;
};

export default TaskHistory;
