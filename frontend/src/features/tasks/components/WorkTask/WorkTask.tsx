import React from "react";
import { FaBug } from "react-icons/fa";
import { FiCornerDownRight, FiFlag, FiGitMerge } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import AssigneePicker from "features/tasks/components/AssigneePicker/AssigneePicker";
import DueBadge from "features/tasks/components/DueBadge/DueBadge";
import LabelChip from "features/tasks/components/LabelChip/LabelChip";
import StartBadge from "features/tasks/components/StartBadge/StartBadge";
import useAssigneeOptions from "features/tasks/hooks/useAssigneeOptions";
import useChangeAssignee from "features/tasks/hooks/useChangeAssignee";
import { formatEnum, formatPoints, isBug, priorityColors, toIsoDate } from "features/tasks/data";
import type { TaskListItem } from "features/tasks/types";

interface WorkTaskProps {
  taskDetails: TaskListItem;
  /** The task whose details are open */
  selected: boolean;
  onOpen: (sequence: string) => void;
}

// How many labels a card shows before "+N"
const CARD_LABELS = 3;

// A task card on the board. Clicking it opens the task details; clicking the avatar changes the assignee.
const WorkTask = ({ taskDetails, selected, onOpen }: WorkTaskProps) => {
  const { options: assigneeOptions } = useAssigneeOptions();
  const changeAssignee = useChangeAssignee();
  const assignee = taskDetails.assignee
    ? { email: taskDetails.assigneeEmail, name: taskDetails.assigneeName ?? "Unknown" }
    : null;
  const labels = taskDetails.labels ?? [];
  const hiddenLabels = labels.slice(CARD_LABELS);
  // Only while it's still ahead; once work has started the due date is what matters
  const upcomingStart = taskDetails.startDate && taskDetails.startDate > toIsoDate(new Date()) ? taskDetails.startDate : null;

  return (
    <div className={selected ? task.cardSelected : task.card}>
      {taskDetails.subtask ? (
        <span className={task.cardParent}>
          <FiCornerDownRight aria-hidden="true" />
          Subtask of {taskDetails.parentTaskId}
        </span>
      ) : null}
      <button type="button" className={task.cardOpen} onClick={() => onOpen(taskDetails.taskSequence)}>
        <span className={task.cardName}>{taskDetails.taskName}</span>
      </button>
      {labels.length ? (
        <span className={task.cardLabels}>
          {labels.slice(0, CARD_LABELS).map((label) => (
            <LabelChip key={label} label={label} />
          ))}
          {hiddenLabels.length ? (
            <span className={task.cardMoreLabels} title={hiddenLabels.join(", ")}>
              +{hiddenLabels.length}
              <span className="sr-only"> more: {hiddenLabels.join(", ")}</span>
            </span>
          ) : null}
        </span>
      ) : null}
      {upcomingStart || taskDetails.dueDate ? (
        <span className={task.cardDates}>
          {upcomingStart ? <StartBadge startDate={upcomingStart} /> : null}
          {taskDetails.dueDate ? <DueBadge dueDate={taskDetails.dueDate} status={taskDetails.status} /> : null}
        </span>
      ) : null}
      <span className={task.cardFooter}>
        {isBug(taskDetails.taskType) ? (
          <span className={task.cardBug}>
            <FaBug aria-hidden="true" />
            Bug
          </span>
        ) : null}
        <span className={task.cardKey}>{taskDetails.taskSequence}</span>
        {taskDetails.priority ? (
          <span className={`${task.priority} ${priorityColors[taskDetails.priority] ?? priorityColors.LOW}`}>
            <FiFlag aria-hidden="true" />
            {formatEnum(taskDetails.priority)}
          </span>
        ) : null}
        {taskDetails.storyPoints ? (
          <span className={task.cardPoints} title={formatPoints(taskDetails.storyPoints)}>
            {taskDetails.storyPoints}
            <span className="sr-only"> story points</span>
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
        <AssigneePicker
          id={`card-assignee-${taskDetails.taskSequence}`}
          variant="avatar"
          assignee={assignee}
          options={assigneeOptions}
          onChange={(option) => changeAssignee(taskDetails.taskSequence, option)}
        />
      </span>
    </div>
  );
};

export default WorkTask;
