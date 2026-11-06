import React, { useState } from "react";
import Helmet from "react-helmet";
import { useLocation } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query/react";

import * as styles from "features/activity/styles/activityClasses";
import * as task from "features/tasks/styles/taskClasses";

import ActivityFilters from "features/activity/components/ActivityFilters/ActivityFilters";
import ActivityList from "features/activity/components/ActivityList/ActivityList";
import TimelineSkeleton from "features/activity/components/Timeline/TimelineSkeleton";
import {
  useGetProjectActivityLogInfiniteQuery,
  useGetProjectActivityPeopleQuery,
} from "features/activity/api/activityApi";
import {
  dateRangeBounds,
  hasActivityFilters,
  isCustomRangeReversed,
  noActivityFilters,
  typesOfKinds,
  type ActivityFilterState,
} from "features/activity/data";
import useCurrentProject from "features/projects/hooks/useCurrentProject";
import type { DashboardType } from "features/dashboard/data";

interface ActivityLogProps {
  type: DashboardType;
  /** projectIdentifier – the "name" query parameter */
  name: string;
}

// The timeline with its filters. Mounted again for each project, so the filters start over.
const ActivityLog = ({ type, name }: ActivityLogProps) => {
  const [filters, setFilters] = useState<ActivityFilterState>(noActivityFilters);
  const team = type === "team";
  const filtered = hasActivityFilters(filters);
  // A range that ends before it starts can't match anything, so nothing is asked for until it is fixed
  const reversed = isCustomRangeReversed(filters);

  const { data: people } = useGetProjectActivityPeopleQuery(team ? name : skipToken);
  const {
    currentData,
    isError,
    isFetchNextPageError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useGetProjectActivityLogInfiniteQuery(
    reversed
      ? skipToken
      : {
          projectIdentifier: name,
          actorId: filters.actorId ?? undefined,
          types: filters.kinds.length ? typesOfKinds(filters.kinds) : undefined,
          ...dateRangeBounds(filters.preset, filters.customFrom, filters.customTo),
        },
  );
  const activities = currentData?.pages.flatMap((page) => page.items);

  const renderContent = () => {
    if (reversed) {
      return <p className={styles.emptyText}>Fix the date range to see the activity.</p>;
    }
    if (activities === undefined) {
      return isError ? (
        <div className={styles.emptyState}>
          <p className={styles.errorText} role="alert">Couldn't load the activity.</p>
          <button type="button" className={task.btnGhost} onClick={() => refetch()}>Try again</button>
        </div>
      ) : (
        <TimelineSkeleton />
      );
    }
    if (activities.length === 0) {
      return filtered ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No activity matches these filters</p>
          <button type="button" className={task.btnGhost} onClick={() => setFilters(noActivityFilters)}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No activity yet</p>
          <p className={styles.emptyText}>New tasks, changes, comments and team members will appear here.</p>
        </div>
      );
    }

    return (
      <>
        <ActivityList activities={activities} />
        <div className={styles.pageFooter}>
          {hasNextPage ? (
            <>
              {isFetchNextPageError ? (
                <p className={styles.errorText} role="alert">Couldn't load older activity.</p>
              ) : null}
              <button
                type="button"
                className={task.btnGhost}
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                aria-busy={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading…" : isFetchNextPageError ? "Try again" : "Load more"}
              </button>
            </>
          ) : (
            <p className={styles.endNote}>
              {filtered ? "No older activity matches these filters." : "You've reached the start of the recorded activity."}
            </p>
          )}
        </div>
      </>
    );
  };

  return (
    <section className={styles.pageCard} aria-label="Activity log">
      <ActivityFilters filters={filters} onChange={setFilters} people={people} showPeople={team} team={team} />
      {renderContent()}
    </section>
  );
};

// Everything that has happened in the project, the latest first
const Activity = ({ type }: { type: DashboardType }) => {
  const { search } = useLocation();
  const name = new URLSearchParams(search).get("name");
  // Undefined while this project's details are loading, so no name is shown
  const { currentData: project } = useCurrentProject();

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{type === "team" ? "Team Dashboard" : "Personal Dashboard"} | Activity</title>
      </Helmet>
      <p className={styles.intro}>
        Everything that has happened in{" "}
        {project?.projectName ? <span className="font-semibold text-brand-ink capitalize">{project.projectName}</span> : "this project"},
        the latest first.
      </p>
      {name ? <ActivityLog key={name} type={type} name={name} /> : null}
    </div>
  );
};

export default Activity;
