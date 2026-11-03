import React from "react";
import { Tooltip } from "@mui/material";
import { FiCornerDownRight, FiFlag, FiGitMerge, FiUserPlus } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import DueBadge from "features/tasks/components/DueBadge/DueBadge";
import { formatEnum, priorityColors } from "features/tasks/data";
import type { TaskListItem } from "features/tasks/types";

interface WorkTaskProps {
  taskDetails: TaskListItem;
  /** The task whose details are open */
  selected: boolean;
  onOpen: (sequence: string) => void;
}

// A task card on the board; clicking it opens the task details
const WorkTask = ({ taskDetails, selected, onOpen }: WorkTaskProps) => {
  const assigneeName = taskDetails.assigneeName ?? "Unknown";

  return (
    <button
      type="button"
      className={selected ? task.cardSelected : task.card}
      onClick={() => onOpen(taskDetails.taskSequence)}
    >
      {taskDetails.subtask ? (
        <span className={task.cardParent}>
          <FiCornerDownRight aria-hidden="true" />
          Subtask of {taskDetails.parentTaskId}
        </span>
      ) : null}
      <span className={task.cardName}>{taskDetails.taskName}</span>
      {taskDetails.dueDate ? <DueBadge dueDate={taskDetails.dueDate} status={taskDetails.status} /> : null}
      <span className={task.cardFooter}>
        <span className={task.cardKey}>{taskDetails.taskSequence}</span>
        {taskDetails.priority ? (
          <span className={`${task.priority} ${priorityColors[taskDetails.priority] ?? priorityColors.LOW}`}>
            <FiFlag aria-hidden="true" />
            {formatEnum(taskDetails.priority)}
          </span>
        ) : null}
        {taskDetails.subtaskCount > 0 ? (
          <span
            className={task.cardSubtaskCount}
            title={`${taskDetails.subtaskCount} ${taskDetails.subtaskCount === 1 ? "subtask" : "subtasks"}`}
          >
            <FiGitMerge aria-hidden="true" />
            {taskDetails.subtaskCount}
          </span>
        ) : null}
        {taskDetails.assignee ? (
          <Tooltip title={assigneeName}>
            <span className={task.cardAssignee} aria-label={`Assignee: ${assigneeName}`}>
              {assigneeName.substring(0, 1)}
            </span>
          </Tooltip>
        ) : (
          // Assigning from the card isn't wired up yet – the assignee is changed in the task details
          <span className={task.cardAssign} aria-hidden="true">
            <FiUserPlus />
          </span>
        )}
      </span>
    </button>
  );
};

export default WorkTask;
