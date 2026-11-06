import React, { useEffect, useRef, useState } from "react";
import { Popover } from "@mui/material";
import { FiCheck, FiSearch, FiUser } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import type { AssigneeOption } from "features/tasks/hooks/useAssigneeOptions";

interface AssigneeMenuProps {
  id: string;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  options: AssigneeOption[];
  /** The assignee's email; null when nobody is assigned */
  value: string | null;
  onSelect: (option: AssigneeOption | null) => void;
}

interface MenuContentProps extends Omit<AssigneeMenuProps, "anchorEl" | "onClose"> {
  inputRef: React.RefObject<HTMLInputElement | null>;
}

// Mounted each time the menu opens, so the search and the highlighted row start fresh
const MenuContent = ({ id, options, value, onSelect, inputRef }: MenuContentProps) => {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const people = options.filter(
    (option) => !search || option.name.toLowerCase().includes(search) || option.email.toLowerCase().includes(search),
  );
  // null is "Unassigned", offered while not searching
  const choices: (AssigneeOption | null)[] = search ? people : [null, ...people];
  const current = choices.findIndex((choice) => (choice?.email ?? null) === value);
  const [active, setActive] = useState(Math.max(current, 0));
  const optionId = (index: number) => `${id}-option-${index}`;

  useEffect(() => {
    document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const last = choices.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last,
    };
    if (e.key in moves) {
      e.preventDefault();
      setActive(moves[e.key]);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (choices.length) {
        onSelect(choices[Math.min(active, last)]);
      }
    }
  };

  return (
    <>
      <div className={task.assigneeSearch}>
        <FiSearch aria-hidden="true" />
        <input
          ref={inputRef}
          className={task.searchInput}
          placeholder="Search people"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-label="Search people"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls={`${id}-list`}
          aria-activedescendant={choices.length ? optionId(Math.min(active, choices.length - 1)) : undefined}
          autoComplete="off"
          autoFocus
        />
      </div>
      {choices.length ? (
        <ul id={`${id}-list`} role="listbox" aria-label="People" className={task.assigneeList}>
          {choices.map((choice, index) => {
            const selected = (choice?.email ?? null) === value;
            return (
              <li
                key={choice?.email ?? "unassigned"}
                id={optionId(index)}
                role="option"
                aria-selected={selected}
                className={index === active ? task.assigneeOptionActive : task.assigneeOption}
                onMouseEnter={() => setActive(index)}
                // Keeps the focus in the search box
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect(choice)}
              >
                {choice ? (
                  <>
                    <span className={task.avatarSmall} aria-hidden="true">{choice.name.substring(0, 1)}</span>
                    <span className={task.assigneeOptionText}>
                      <span className={task.assigneeOptionName}>
                        <span>{choice.name}</span>
                        {choice.lead ? <span className={task.leadBadge}>Lead</span> : null}
                      </span>
                      <span className={task.assigneeOptionEmail}>{choice.email}</span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className={task.avatarNone} aria-hidden="true"><FiUser /></span>
                    <span className={task.assigneeOptionText}>Unassigned</span>
                  </>
                )}
                {selected ? <FiCheck className={task.assigneeCheck} aria-hidden="true" /> : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p id={`${id}-list`} className={task.assigneeEmpty}>{options.length ? "Nobody matches" : "Nobody to assign in this project"}</p>
      )}
    </>
  );
};

// A popover to pick who a task is assigned to: search, then click or use the arrow keys and Enter
const AssigneeMenu = ({ anchorEl, onClose, ...props }: AssigneeMenuProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      PaperProps={{ className: task.assigneeMenu }}
      // MUI's focus trap can take the focus off an autoFocus field, so the search box is focused once the menu is in
      TransitionProps={{ onEntered: () => inputRef.current?.focus() }}
    >
      <MenuContent
        {...props}
        inputRef={inputRef}
        onSelect={(option) => {
          onClose();
          props.onSelect(option);
        }}
      />
    </Popover>
  );
};

export default AssigneeMenu;
