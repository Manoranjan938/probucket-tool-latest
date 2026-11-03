import React from "react";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";

import * as styles from "features/activity/styles/activityClasses";

import { formatDay, formatEntryTime } from "features/activity/data";

export interface TimelineEntry {
  id: number | string;
  /** ISO date */
  date: string;
  icon: IconType;
  /** One of the tone classes in activityClasses */
  tone: string;
  /** What happened */
  content: ReactNode;
  /** Shown beside the time, e.g. the task's name */
  detail?: string | null;
}

// Entries are expected newest first, so each day's entries are next to each other
const groupByDay = (entries: TimelineEntry[]) => {
  const days: { label: string; entries: TimelineEntry[] }[] = [];

  entries.forEach((entry) => {
    const label = formatDay(entry.date);
    const lastDay = days[days.length - 1];
    if (lastDay?.label === label) {
      lastDay.entries.push(entry);
    } else {
      days.push({ label, entries: [entry] });
    }
  });

  return days;
};

// A vertical timeline with a heading per day. The icon's colour only adds to the sentence, which says what happened.
const Timeline = ({ entries }: { entries: TimelineEntry[] }) => {
  return (
    <div>
      {groupByDay(entries).map((day) => (
        <div key={day.label} className={styles.day}>
          <p className={styles.dayLabel}>{day.label}</p>
          <ol className={styles.list}>
            {day.entries.map((entry) => (
              <li key={entry.id} className={styles.entry}>
                <span className={`${styles.icon} ${entry.tone}`} aria-hidden="true">
                  <entry.icon />
                </span>
                <div className={styles.body}>
                  <p className={styles.sentence}>{entry.content}</p>
                  <p className={styles.meta}>
                    {entry.detail ? (
                      <>
                        <span className={styles.detail} title={entry.detail}>{entry.detail}</span>
                        <span aria-hidden="true">·</span>
                      </>
                    ) : null}
                    <time className={styles.time} dateTime={entry.date} title={new Date(entry.date).toLocaleString()}>
                      {formatEntryTime(entry.date)}
                    </time>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
