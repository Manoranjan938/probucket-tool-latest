import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import { FiChevronDown, FiUser, FiUserPlus } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import AssigneeMenu from "features/tasks/components/AssigneePicker/AssigneeMenu";
import type { AssigneeOption } from "features/tasks/hooks/useAssigneeOptions";

export interface CurrentAssignee {
  /** null when the person isn't known by email, e.g. an older task */
  email: string | null;
  name: string;
}

interface AssigneePickerProps {
  /** Unique on the page */
  id: string;
  /** field: looks like the other inputs (dialogs); inline: a row value (task details); avatar: a board card's avatar */
  variant: "field" | "inline" | "avatar";
  /** null when nobody is assigned */
  assignee: CurrentAssignee | null;
  options: AssigneeOption[];
  /** Only called when the choice differs from the current assignee */
  onChange: (option: AssigneeOption | null) => void;
}

// Shows who a task is assigned to; clicking it opens a menu to pick someone else, or nobody
const AssigneePicker = ({ id, variant, assignee, options, onChange }: AssigneePickerProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const lead = !!assignee && options.some((option) => option.email === assignee.email && option.lead);
  const label = `Assignee: ${assignee ? assignee.name : "Unassigned"}. Change`;

  const triggerProps = {
    type: "button" as const,
    id,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget),
    "aria-haspopup": "listbox" as const,
    "aria-expanded": Boolean(anchorEl),
    "aria-label": label,
  };

  const trigger =
    variant === "avatar" ? (
      <Tooltip title={assignee ? assignee.name : "Assign"}>
        <button {...triggerProps} className={task.cardAssigneeButton}>
          {assignee ? (
            <span className={task.cardAssignee} aria-hidden="true">{assignee.name.substring(0, 1)}</span>
          ) : (
            <span className={task.cardAssign} aria-hidden="true"><FiUserPlus /></span>
          )}
        </button>
      </Tooltip>
    ) : (
      <button {...triggerProps} className={variant === "field" ? task.assigneeTrigger : task.assigneeInline}>
        {assignee ? (
          <>
            <span className={task.avatarSmall} aria-hidden="true">{assignee.name.substring(0, 1)}</span>
            <span className={task.assigneeName}>{assignee.name}</span>
            {lead ? <span className={task.leadBadge}>Lead</span> : null}
          </>
        ) : (
          <>
            <span className={task.avatarNone} aria-hidden="true"><FiUser /></span>
            <span className={task.assigneeNone}>Unassigned</span>
          </>
        )}
        <FiChevronDown className={task.assigneeChevron} aria-hidden="true" />
      </button>
    );

  return (
    <>
      {trigger}
      <AssigneeMenu
        id={`${id}-menu`}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        options={options}
        value={assignee?.email ?? null}
        onSelect={(option) => {
          if ((option?.email ?? null) !== (assignee?.email ?? null)) {
            onChange(option);
          }
        }}
      />
    </>
  );
};

export default AssigneePicker;
