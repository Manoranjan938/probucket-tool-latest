import React, { useEffect, useState } from "react";

import * as task from "features/tasks/styles/taskClasses";

import ActivityList from "features/activity/components/ActivityList/ActivityList";
import TimelineSkeleton from "features/activity/components/Timeline/TimelineSkeleton";
import useGetActivity from "features/activity/hooks/useGetActivity";
import type { Activity } from "features/activity/types";
import { useAppSelector } from "app/hooks";

// Everything recorded about the open task, the latest first
const TaskHistory = () => {
  const currentTask = useAppSelector((state) => state.tasks.selectedTask);
  const { getTaskActivity } = useGetActivity();
  // undefined while loading, null if it couldn't be loaded
  const [activities, setActivities] = useState<Activity[] | null>();

  // A change made in the details reloads the task, and then this list
  useEffect(() => {
    let current = true;
    getTaskActivity(currentTask.taskSequence)
      .then((resp) => {
        if (current) {
          setActivities(resp.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
        if (current) {
          setActivities(null);
        }
      });
    return () => {
      current = false;
    };
  }, [currentTask.taskSequence, currentTask.status, currentTask.assignee, currentTask.dueDate, currentTask.updatedOn]);

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
