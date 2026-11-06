import React, { useState } from "react";
import type { ReactNode } from "react";
import { Menu, MenuItem } from "@mui/material";
import { FiCheck, FiChevronDown } from "react-icons/fi";

import * as styles from "features/activity/styles/activityClasses";

import {
  activityKinds,
  dateRangePresets,
  formatFilterDate,
  hasActivityFilters,
  isCustomRangeReversed,
  noActivityFilters,
  toDateInputValue,
  type ActivityFilterState,
} from "features/activity/data";
import type { ActivityPerson } from "features/activity/types";

interface FilterButtonProps {
  id: string;
  label: string;
  value: string;
  active: boolean;
  /** The menu's items; close closes the menu */
  children: (close: () => void) => ReactNode;
}

// A rounded button that shows a filter's current value and opens its menu
const FilterButton = ({ id, label, value, active, children }: FilterButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const close = () => setAnchorEl(null);

  return (
    <>
      <button
        type="button"
        id={`${id}-button`}
        className={active ? styles.filterButtonActive : styles.filterButton}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
      >
        <span className={styles.filterButtonLabel}>{label}:</span>
        <span className={styles.filterButtonValue}>{value}</span>
        <FiChevronDown className={styles.filterChevron} aria-hidden="true" />
      </button>
      <Menu
        id={`${id}-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={close}
        MenuListProps={{ "aria-labelledby": `${id}-button` }}
        PaperProps={{ className: styles.menuPaper }}
      >
        {children(close)}
      </Menu>
    </>
  );
};

// The tick of a single-choice item; the empty slot keeps the names lined up
const Selected = ({ selected }: { selected: boolean }) =>
  selected ? <FiCheck className={styles.menuCheck} aria-hidden="true" /> : <span className={styles.menuCheckSlot} />;

interface ActivityFiltersProps {
  filters: ActivityFilterState;
  onChange: (filters: ActivityFilterState) => void;
  /** Everyone in the log; undefined while loading. Without it there is no person filter. */
  people?: ActivityPerson[];
  showPeople: boolean;
  /** Team members are only added in a team project */
  team: boolean;
}

// Person, kind of change and date range above the Activity page's timeline
const ActivityFilters = ({ filters, onChange, people, showPeople, team }: ActivityFiltersProps) => {
  const { actorId, kinds, preset, customFrom, customTo } = filters;
  const update = (changes: Partial<ActivityFilterState>) => onChange({ ...filters, ...changes });
  const kindOptions = activityKinds.filter((kind) => team || !kind.teamOnly);
  const today = toDateInputValue(new Date());

  const personName = people?.find((person) => person.actorId === actorId)?.name ?? "Someone";

  const kindValue =
    kinds.length === 0
      ? "All changes"
      : kinds.length === 1
        ? (kindOptions.find((kind) => kind.id === kinds[0])?.label ?? "1 kind")
        : `${kinds.length} kinds`;

  const dateValue =
    preset !== "custom"
      ? (dateRangePresets.find((option) => option.id === preset)?.label ?? "Any time")
      : customFrom && customTo
        ? `${formatFilterDate(customFrom)} – ${formatFilterDate(customTo)}`
        : customFrom
          ? `From ${formatFilterDate(customFrom)}`
          : customTo
            ? `Until ${formatFilterDate(customTo)}`
            : "Custom range";

  const reversed = isCustomRangeReversed(filters);

  return (
    <div className={styles.filters} role="group" aria-label="Filter activity">
      <div className={styles.filterRow}>
        {showPeople ? (
          <FilterButton id="activity-person" label="Person" value={actorId ? personName : "Everyone"} active={actorId !== null}>
            {(close) => [
              <MenuItem
                key="everyone"
                role="menuitemradio"
                aria-checked={actorId === null}
                className={styles.menuItem}
                onClick={() => {
                  close();
                  update({ actorId: null });
                }}
              >
                <Selected selected={actorId === null} />
                <span className={styles.menuItemLabel}>Everyone</span>
              </MenuItem>,
              ...(people ?? []).map((person) => (
                <MenuItem
                  key={person.actorId}
                  role="menuitemradio"
                  aria-checked={actorId === person.actorId}
                  className={styles.menuItem}
                  onClick={() => {
                    close();
                    update({ actorId: person.actorId });
                  }}
                >
                  <Selected selected={actorId === person.actorId} />
                  <span className={styles.personAvatar} aria-hidden="true">{(person.name ?? "?").substring(0, 1)}</span>
                  <span className={styles.menuItemLabel}>{person.name ?? "Someone"}</span>
                </MenuItem>
              )),
              people === undefined ? (
                <li key="loading" role="presentation" className="px-4 py-2 text-[14px] text-brand-muted">Loading people…</li>
              ) : null,
            ]}
          </FilterButton>
        ) : null}

        <FilterButton id="activity-kind" label="Kind" value={kindValue} active={kinds.length > 0}>
          {() => [
            <MenuItem
              key="all"
              role="menuitemradio"
              aria-checked={kinds.length === 0}
              className={styles.menuItem}
              onClick={() => update({ kinds: [] })}
            >
              <Selected selected={kinds.length === 0} />
              <span className={styles.menuItemLabel}>All changes</span>
            </MenuItem>,
            ...kindOptions.map((kind) => {
              const checked = kinds.includes(kind.id);
              return (
                // Stays open, so several kinds can be ticked in a row
                <MenuItem
                  key={kind.id}
                  role="menuitemcheckbox"
                  aria-checked={checked}
                  className={styles.menuItem}
                  onClick={() =>
                    update({ kinds: checked ? kinds.filter((id) => id !== kind.id) : [...kinds, kind.id] })
                  }
                >
                  <span className={checked ? styles.checkboxOn : styles.checkbox} aria-hidden="true">
                    <FiCheck />
                  </span>
                  <span className={styles.menuItemText}>
                    <span className={styles.menuItemLabel}>{kind.label}</span>
                    <span className={styles.menuItemHint}>{kind.hint}</span>
                  </span>
                </MenuItem>
              );
            }),
          ]}
        </FilterButton>

        <FilterButton id="activity-date" label="Date" value={dateValue} active={preset !== "any"}>
          {(close) =>
            dateRangePresets.map((option) => (
              <MenuItem
                key={option.id}
                role="menuitemradio"
                aria-checked={preset === option.id}
                className={styles.menuItem}
                onClick={() => {
                  close();
                  update({ preset: option.id });
                }}
              >
                <Selected selected={preset === option.id} />
                <span className={styles.menuItemLabel}>{option.label}</span>
              </MenuItem>
            ))
          }
        </FilterButton>

        {hasActivityFilters(filters) ? (
          <button type="button" className={styles.clearFilters} onClick={() => onChange(noActivityFilters)}>
            Clear filters
          </button>
        ) : null}
      </div>

      {preset === "custom" ? (
        <div className={styles.customRange}>
          <div className={styles.dateField}>
            <label htmlFor="activity-from" className={styles.dateLabel}>From</label>
            <input
              id="activity-from"
              type="date"
              className={styles.dateInput}
              value={customFrom}
              max={customTo || today}
              onChange={(e) => update({ customFrom: e.target.value })}
              aria-invalid={reversed}
              aria-describedby={reversed ? "activity-range-error" : undefined}
            />
          </div>
          <div className={styles.dateField}>
            <label htmlFor="activity-to" className={styles.dateLabel}>To</label>
            <input
              id="activity-to"
              type="date"
              className={styles.dateInput}
              value={customTo}
              min={customFrom || undefined}
              max={today}
              onChange={(e) => update({ customTo: e.target.value })}
              aria-invalid={reversed}
              aria-describedby={reversed ? "activity-range-error" : undefined}
            />
          </div>
          {reversed ? (
            <p id="activity-range-error" className={`${styles.errorText} pb-2`} role="alert">
              The end date is before the start date.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default ActivityFilters;
