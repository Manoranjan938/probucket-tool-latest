import React, { useState } from "react";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import { FiChevronDown, FiCopy, FiFlag, FiPlus, FiUser } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import { formatEnum, priorityColors, taskStatuses } from "features/tasks/data";
import type { Subtask } from "features/tasks/types";

interface SubTaskProps {
  subtask: Subtask[];
  onAdd: () => void;
}

// The subtasks of the open task
const SubTask = ({ subtask, onAdd }: SubTaskProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <section className={task.section} aria-labelledby="subtasks-title">
      <div className={task.sectionHeader}>
        <h3 id="subtasks-title" className={task.sectionTitle}>
          Subtasks<span className={task.sectionCount}>{subtask.length}</span>
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={task.orderBy}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            Order by
            <FiChevronDown aria-hidden="true" />
          </button>
          <Tooltip title="Add subtask">
            <button type="button" className={task.iconButton} onClick={onAdd} aria-label="Add subtask">
              <FiPlus />
            </button>
          </Tooltip>
        </div>
      </div>

      {subtask.length > 0 ? (
        <ul className={task.subtaskList}>
          {subtask.map((item) => {
            const status = taskStatuses[item.status] ?? taskStatuses.TODO;
            const assignee = item.assignee && item.assignee !== "NA" ? item.assignee : "Unassigned";
            return (
              <li key={item.taskSequence} className={task.subtaskRow}>
                <span className={task.subtaskIcon} aria-hidden="true"><FiCopy /></span>
                <span className={task.subtaskKey}>{item.taskSequence}</span>
                <span className={task.subtaskName} title={item.taskName}>{item.taskName}</span>
                <span className={task.subtaskMeta}>
                  <Tooltip title={`Priority: ${formatEnum(item.priority) || "None"}`}>
                    <span className={`${task.iconButton} ${priorityColors[item.priority] ?? ""}`}>
                      <FiFlag aria-label={`Priority: ${formatEnum(item.priority) || "None"}`} />
                    </span>
                  </Tooltip>
                  <Tooltip title={`Assignee: ${assignee}`}>
                    <span className={task.iconButton}>
                      <FiUser aria-label={`Assignee: ${assignee}`} />
                    </span>
                  </Tooltip>
                  {/* Changing a subtask's status from here isn't wired up yet */}
                  <span className={`${task.statusPill} ${status.soft} ${status.text}`}>
                    {status.label}
                    <FiChevronDown aria-hidden="true" />
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-[14px] text-brand-muted">No subtasks yet.</p>
      )}

      {/* Sorting isn't wired up yet */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Created</MenuItem>
        <MenuItem onClick={handleClose}>Key</MenuItem>
        <MenuItem onClick={handleClose}>Priority</MenuItem>
        <MenuItem onClick={handleClose}>Status</MenuItem>
        <MenuItem onClick={handleClose}>Assignee</MenuItem>
      </Menu>
    </section>
  );
};

export default SubTask;
