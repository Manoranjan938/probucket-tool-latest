import React from "react";
import { FiFlag, FiUserPlus } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

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
  return (
    <button
      type="button"
      className={selected ? task.cardSelected : task.card}
      onClick={() => onOpen(taskDetails.taskSequence)}
    >
      <span className={task.cardName}>{taskDetails.taskName}</span>
      <span className={task.cardFooter}>
        <span className={task.cardKey}>{taskDetails.taskSequence}</span>
        {taskDetails.priority ? (
          <span className={`${task.priority} ${priorityColors[taskDetails.priority] ?? priorityColors.LOW}`}>
            <FiFlag aria-hidden="true" />
            {formatEnum(taskDetails.priority)}
          </span>
        ) : null}
        {/* Assigning from the card isn't wired up yet – the assignee is changed in the task details */}
        <span className={task.cardAssign} aria-hidden="true">
          <FiUserPlus />
        </span>
      </span>
    </button>
  );
};

export default WorkTask;
