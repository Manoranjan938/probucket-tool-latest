import React, { useEffect, useState } from "react";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";

import * as task from "features/tasks/styles/taskClasses";

import ActivityList from "features/activity/components/ActivityList/ActivityList";
import TimelineSkeleton from "features/activity/components/Timeline/TimelineSkeleton";
import useGetActivity from "features/activity/hooks/useGetActivity";
import type { Activity } from "features/activity/types";
import type { RootState } from "app/store";

// Everything recorded about the open task, the latest first
const TaskHistory = ({ currentTask }: Props) => {
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

const mapStateToProps = (state: RootState) => ({
  currentTask: state.tasks.selectedTask,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(TaskHistory);
