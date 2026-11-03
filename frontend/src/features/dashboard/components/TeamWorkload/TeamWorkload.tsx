import React from "react";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import BarRow from "features/dashboard/components/BarRow/BarRow";
import BarRowsSkeleton from "features/dashboard/components/BarRow/BarRowsSkeleton";
import { isActive } from "features/team/data";
import type { TaskListItem } from "features/tasks/types";
import type { TeamMember } from "features/team/types";

interface Workload {
  id: string;
  name: string;
  open: number;
  completed: number;
}

// Everyone on the team, plus anyone holding tasks who isn't on it (e.g. removed from the team later).
// Inactive members only show while they still hold tasks.
const buildWorkloads = (tasks: TaskListItem[], team: TeamMember[]) => {
  const workloads = new Map<string, Workload>(
    team.map((member) => [member.memberId, { id: member.memberId, name: member.name, open: 0, completed: 0 }])
  );

  tasks.forEach((task) => {
    if (!task.assignee) {
      return;
    }
    const workload = workloads.get(task.assignee) ?? {
      id: task.assignee,
      name: task.assigneeName ?? "Unknown",
      open: 0,
      completed: 0,
    };
    if (task.status === "COMPLETED") {
      workload.completed++;
    } else {
      workload.open++;
    }
    workloads.set(task.assignee, workload);
  });

  const inactive = new Set(team.filter((member) => !isActive(member)).map((member) => member.memberId));

  return [...workloads.values()]
    .filter((workload) => !inactive.has(workload.id) || workload.open + workload.completed > 0)
    .sort((a, b) => b.open - a.open || a.name.localeCompare(b.name));
};

interface TeamWorkloadProps {
  /** undefined while loading */
  tasks: TaskListItem[] | undefined;
  /** undefined while loading */
  team: TeamMember[] | undefined;
}

// Team dashboard home: open tasks per person, most loaded first. The longest bar is the busiest person.
const TeamWorkload = ({ tasks, team }: TeamWorkloadProps) => {
  const workloads = tasks && team ? buildWorkloads(tasks, team) : [];
  const mostOpen = Math.max(...workloads.map((workload) => workload.open), 0);

  return (
    <section className={dashboard.card} aria-labelledby="workload-title">
      <div className={dashboard.cardHeader}>
        <h2 id="workload-title" className={dashboard.cardTitle}>Team workload</h2>
      </div>

      {tasks === undefined || team === undefined ? (
        <BarRowsSkeleton />
      ) : workloads.length > 0 ? (
        <ul className={dashboard.barList}>
          {workloads.map((workload) => (
            <BarRow
              key={workload.id}
              label={
                <>
                  <span className={dashboard.barAvatar} aria-hidden="true">{workload.name.substring(0, 1)}</span>
                  <span className={dashboard.barName}>{workload.name}</span>
                </>
              }
              value={`${workload.open} open · ${workload.completed} done`}
              percent={mostOpen > 0 ? Math.round((workload.open / mostOpen) * 100) : 0}
              tooltip={`${workload.name}: ${workload.open} open, ${workload.completed} completed`}
            />
          ))}
        </ul>
      ) : (
        <p className={dashboard.cardEmptyText}>No team members yet.</p>
      )}
    </section>
  );
};

export default TeamWorkload;
