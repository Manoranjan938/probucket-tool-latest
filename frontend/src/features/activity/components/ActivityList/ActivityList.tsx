import React from "react";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  FiActivity,
  FiCalendar,
  FiCheck,
  FiCircle,
  FiClock,
  FiEdit2,
  FiFlag,
  FiGitMerge,
  FiMessageSquare,
  FiPlus,
  FiUserCheck,
  FiUserPlus,
} from "react-icons/fi";

import * as styles from "features/activity/styles/activityClasses";

import Timeline from "features/activity/components/Timeline/Timeline";
import { formatDueDate, formatEnum, taskStatuses } from "features/tasks/data";
import type { Activity } from "features/activity/types";

const Strong = ({ children }: { children: ReactNode }) => <span className={styles.strong}>{children}</span>;

const TaskKey = ({ children }: { children: ReactNode }) => <span className={styles.taskKey}>{children}</span>;

const StatusPill = ({ status }: { status: string | null }) => {
  const style = status ? taskStatuses[status] : undefined;

  return style ? (
    <span className={`${styles.statusPill} ${style.soft} ${style.text}`}>{style.label}</span>
  ) : (
    <Strong>{status}</Strong>
  );
};

// What happened, after the person's name. target is the task's key, or "this task" inside the task itself.
const describe = (activity: Activity, target: ReactNode): ReactNode => {
  const { type, oldValue, newValue } = activity;

  switch (type) {
    case "TASK_CREATED":
      return <>created {target}</>;
    case "SUBTASK_CREATED":
      return <>created subtask {target} in <TaskKey>{newValue}</TaskKey></>;
    case "STATUS_CHANGED":
      return <>moved {target} to <StatusPill status={newValue} /></>;
    case "PRIORITY_CHANGED":
      return (
        <>changed the priority of {target} from <Strong>{formatEnum(oldValue ?? undefined) || "none"}</Strong> to{" "}
          <Strong>{formatEnum(newValue ?? undefined)}</Strong></>
      );
    case "ASSIGNEE_CHANGED":
      return oldValue ? (
        <>reassigned {target} from <Strong>{oldValue}</Strong> to <Strong>{newValue}</Strong></>
      ) : (
        <>assigned {target} to <Strong>{newValue}</Strong></>
      );
    case "DUE_DATE_CHANGED":
      if (!newValue) {
        return <>removed the due date of {target}</>;
      }
      return oldValue ? (
        <>changed the due date of {target} from <Strong>{formatDueDate(oldValue)}</Strong> to{" "}
          <Strong>{formatDueDate(newValue)}</Strong></>
      ) : (
        <>set the due date of {target} to <Strong>{formatDueDate(newValue)}</Strong></>
      );
    case "DESCRIPTION_CHANGED":
      return <>edited the description of {target}</>;
    case "COMMENT_ADDED":
      return <>commented on {target}</>;
    case "MEMBER_ADDED":
      return <>added <Strong>{newValue}</Strong> to the team</>;
    default:
      return <>made a change</>;
  }
};

const statusIcons: Record<string, { icon: IconType; tone: string }> = {
  COMPLETED: { icon: FiCheck, tone: styles.toneDone },
  INPROGRESS: { icon: FiClock, tone: styles.toneProgress },
  TODO: { icon: FiCircle, tone: styles.toneNeutral },
};

const priorityTones: Record<string, string> = {
  HIGH: styles.toneOverdue,
  MEDIUM: styles.toneSoon,
  LOW: styles.toneNeutral,
};

// The icon and its colour, by the kind of change
const appearance = ({ type, newValue }: Activity): { icon: IconType; tone: string } => {
  switch (type) {
    case "TASK_CREATED":
      return { icon: FiPlus, tone: styles.toneBrand };
    case "SUBTASK_CREATED":
      return { icon: FiGitMerge, tone: styles.toneBrand };
    case "STATUS_CHANGED":
      return (newValue && statusIcons[newValue]) || statusIcons.TODO;
    case "PRIORITY_CHANGED":
      return { icon: FiFlag, tone: (newValue && priorityTones[newValue]) || styles.toneNeutral };
    case "ASSIGNEE_CHANGED":
      return { icon: FiUserCheck, tone: styles.toneBrand };
    case "DUE_DATE_CHANGED":
      return { icon: FiCalendar, tone: newValue ? styles.toneSoon : styles.toneNeutral };
    case "DESCRIPTION_CHANGED":
      return { icon: FiEdit2, tone: styles.toneNeutral };
    case "COMMENT_ADDED":
      return { icon: FiMessageSquare, tone: styles.toneComment };
    case "MEMBER_ADDED":
      return { icon: FiUserPlus, tone: styles.toneBrand };
    default:
      return { icon: FiActivity, tone: styles.toneNeutral };
  }
};

interface ActivityListProps {
  activities: Activity[];
  /** Inside a task's own history the sentences say "this task", and the task's name isn't repeated */
  withinTask?: boolean;
}

const ActivityList = ({ activities, withinTask = false }: ActivityListProps) => {
  return (
    <Timeline
      entries={activities.map((activity) => {
        const target =
          withinTask && activity.type !== "SUBTASK_CREATED" ? "this task" : <TaskKey>{activity.taskSequence}</TaskKey>;

        return {
          id: activity.id,
          date: activity.createdOn,
          ...appearance(activity),
          content: (
            <>
              <Strong>{activity.actorName ?? "Someone"}</Strong> {describe(activity, target)}
            </>
          ),
          detail: withinTask ? null : activity.taskName,
        };
      })}
    />
  );
};

export default ActivityList;
