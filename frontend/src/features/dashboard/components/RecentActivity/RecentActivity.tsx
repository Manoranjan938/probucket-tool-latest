import React, { useEffect, useState } from "react";
import { FiEdit2, FiPlus } from "react-icons/fi";

import * as activity from "features/activity/styles/activityClasses";
import * as dashboard from "features/dashboard/styles/dashboardClasses";

import ActivityList from "features/activity/components/ActivityList/ActivityList";
import Timeline from "features/activity/components/Timeline/Timeline";
import TimelineSkeleton from "features/activity/components/Timeline/TimelineSkeleton";
import useGetActivity from "features/activity/hooks/useGetActivity";
import type { Activity } from "features/activity/types";
import type { TaskListItem } from "features/tasks/types";

const MAX_RECENT_TASKS = 5;

const lastChange = (task: TaskListItem) => task.updatedOn ?? task.createdOn ?? "";

interface RecentActivityProps {
  /** projectIdentifier – the "name" query parameter */
  name: string | null;
  /** undefined while loading */
  tasks: TaskListItem[] | undefined;
}

// The project's latest changes. Nothing was recorded before this feature existed, so until there is
// something to show, it lists the tasks that changed last: their dates are known, but not who changed them.
const RecentActivity = ({ name, tasks }: RecentActivityProps) => {
  const { getProjectActivity } = useGetActivity();
  const [activities, setActivities] = useState<Activity[]>();

  useEffect(() => {
    let current = true;
    setActivities(undefined);
    getProjectActivity(name)
      .then((resp) => {
        if (current) {
          setActivities(resp.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
        if (current) {
          setActivities([]);
        }
      });
    return () => {
      current = false;
    };
  }, [name]);

  const recentTasks = [...(tasks ?? [])]
    .filter(lastChange)
    .sort((a, b) => lastChange(b).localeCompare(lastChange(a)))
    .slice(0, MAX_RECENT_TASKS);

  return (
    <section className={dashboard.card} aria-labelledby="recent-activity-title">
      <div className={dashboard.cardHeader}>
        <h2 id="recent-activity-title" className={dashboard.cardTitle}>Recent activity</h2>
      </div>

      {activities === undefined || (activities.length === 0 && tasks === undefined) ? (
        <TimelineSkeleton />
      ) : activities.length > 0 ? (
        <ActivityList activities={activities} />
      ) : recentTasks.length > 0 ? (
        <>
          <Timeline
            entries={recentTasks.map((task) => ({
              id: task.taskSequence,
              date: lastChange(task),
              icon: task.updatedOn ? FiEdit2 : FiPlus,
              tone: task.updatedOn ? activity.toneNeutral : activity.toneBrand,
              content: (
                <>
                  <span className={activity.taskKey}>{task.taskSequence}</span> was{" "}
                  {task.updatedOn ? "updated" : "created"}
                </>
              ),
              detail: task.taskName,
            }))}
          />
          <p className={dashboard.cardNote}>New changes will appear here with who made them.</p>
        </>
      ) : (
        <p className={dashboard.cardEmptyText}>No activity yet.</p>
      )}
    </section>
  );
};

export default RecentActivity;
