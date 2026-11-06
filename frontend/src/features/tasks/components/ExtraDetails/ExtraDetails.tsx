import React, { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { FiFlag } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import AssigneePicker from "features/tasks/components/AssigneePicker/AssigneePicker";
import DueBadge from "features/tasks/components/DueBadge/DueBadge";
import EstimateDialog from "features/tasks/components/EstimateDialog/EstimateDialog";
import LabelChip from "features/tasks/components/LabelChip/LabelChip";
import LabelsDialog from "features/tasks/components/LabelsDialog/LabelsDialog";
import TaskDateDialog, { type TaskDateKind } from "features/tasks/components/TaskDateDialog/TaskDateDialog";
import { useGetProjectLabelsQuery } from "features/tasks/api/tasksApi";
import useSelectedTask from "features/tasks/hooks/useSelectedTask";
import useAssigneeOptions from "features/tasks/hooks/useAssigneeOptions";
import useChangeAssignee from "features/tasks/hooks/useChangeAssignee";
import useCurrentProject from "features/projects/hooks/useCurrentProject";
import { formatDate, formatDueDate, formatEnum, formatPoints, priorityColors } from "features/tasks/data";
import type { TaskDetails } from "features/tasks/types";
import { useAppSelector } from "app/hooks";

// The task's assignee, priority, estimate, dates and labels. The assignee changes right here; the rest in small dialogs.
const ExtraDetails = () => {
  const currentTask: Partial<TaskDetails> = useSelectedTask().currentData ?? {};
  const currentUser = useAppSelector((state) => state.security.user);
  const { options: assigneeOptions } = useAssigneeOptions();
  const changeAssignee = useChangeAssignee();
  const [dateDialog, setDateDialog] = useState<TaskDateKind | null>(null);
  const [showEstimateDialog, setShowEstimateDialog] = useState(false);
  const [showLabelsDialog, setShowLabelsDialog] = useState(false);
  const projectIdentifier = useCurrentProject().currentData?.projectIdentifier;
  const { data: projectLabels = [] } = useGetProjectLabelsQuery(projectIdentifier ?? skipToken);
  const labels = currentTask.labels ?? [];

  const assigneeName = currentTask.assignee && currentTask.assignee !== "NA" ? currentTask.assignee : null;
  const assignee = assigneeName ? { email: currentTask.assigneeEmail ?? null, name: assigneeName } : null;
  // The shortcut is offered while you could be assigned but aren't
  const me = assigneeOptions.find((option) => option.email === currentUser.username);
  const canAssignMe = !!me && currentTask.assigneeEmail !== me.email;

  return (
    <>
      <div className={task.sideCard}>
        <h3 className={task.sideCardTitle}>Details</h3>
        <div className={task.detailRow}>
          <span className={task.detailLabel}>Assignee</span>
          <span className={task.detailValue}>
            <AssigneePicker
              id="details-assignee"
              variant="inline"
              assignee={assignee}
              options={assigneeOptions}
              onChange={(option) => changeAssignee(currentTask.taskSequence!, option)}
            />
            {canAssignMe ? (
              <button type="button" className={`${task.linkButton} ml-auto shrink-0`} onClick={() => changeAssignee(currentTask.taskSequence!, me)}>
                Assign to me
              </button>
            ) : null}
          </span>
        </div>
        <div className={task.detailRow}>
          <span className={task.detailLabel}>Priority</span>
          <span className={task.detailValue}>
            {currentTask.priority ? (
              <>
                <FiFlag className={priorityColors[currentTask.priority] ?? priorityColors.LOW} aria-hidden="true" />
                {formatEnum(currentTask.priority)}
              </>
            ) : (
              <span className="font-normal text-brand-muted">None</span>
            )}
          </span>
        </div>
        <div className={task.detailRow}>
          <span className={task.detailLabel}>Estimate</span>
          <span className={task.detailValue}>
            {currentTask.storyPoints ? (
              <>
                <span className={task.cardPoints} aria-hidden="true">{currentTask.storyPoints}</span>
                {formatPoints(currentTask.storyPoints)}
              </>
            ) : (
              <span className="font-normal text-brand-muted">None</span>
            )}
            <button type="button" className={`${task.linkButton} ml-auto`} onClick={() => setShowEstimateDialog(true)}>
              {currentTask.storyPoints ? "Change" : "Set"}
            </button>
          </span>
        </div>
        <div className={task.detailRow}>
          <span className={task.detailLabel}>Start date</span>
          <span className={task.detailValue}>
            {currentTask.startDate ? (
              formatDueDate(currentTask.startDate)
            ) : (
              <span className="font-normal text-brand-muted">None</span>
            )}
            <button type="button" className={`${task.linkButton} ml-auto`} onClick={() => setDateDialog("start")}>
              {currentTask.startDate ? "Change" : "Set"}
            </button>
          </span>
        </div>
        <div className={task.detailRow}>
          <span className={task.detailLabel}>Due date</span>
          <span className={task.detailValue}>
            {currentTask.dueDate ? (
              <DueBadge dueDate={currentTask.dueDate} status={currentTask.status} />
            ) : (
              <span className="font-normal text-brand-muted">None</span>
            )}
            <button type="button" className={`${task.linkButton} ml-auto`} onClick={() => setDateDialog("due")}>
              {currentTask.dueDate ? "Change" : "Set"}
            </button>
          </span>
        </div>
        <div className={task.detailRow}>
          <span className={task.detailLabel}>Labels</span>
          <span className={task.detailValueWrap}>
            {labels.length ? (
              labels.map((label) => <LabelChip key={label} label={label} />)
            ) : (
              <span className="font-normal text-brand-muted">None</span>
            )}
            <button type="button" className={`${task.linkButton} ml-auto`} onClick={() => setShowLabelsDialog(true)}>
              {labels.length ? "Edit" : "Add"}
            </button>
          </span>
        </div>
        <div className={task.detailRow}>
          <span className={task.detailLabel}>Created</span>
          <span className={task.detailValue}>{formatDate(currentTask.createdOn) || "–"}</span>
        </div>
        <div className={task.detailRow}>
          <span className={task.detailLabel}>Updated</span>
          <span className={task.detailValue}>{formatDate(currentTask.updatedOn) || "–"}</span>
        </div>
      </div>

      <TaskDateDialog
        kind={dateDialog ?? "due"}
        open={dateDialog !== null}
        onClose={() => setDateDialog(null)}
        taskId={currentTask.taskSequence}
        date={dateDialog === "start" ? currentTask.startDate : currentTask.dueDate}
        otherDate={dateDialog === "start" ? currentTask.dueDate : currentTask.startDate}
      />

      <EstimateDialog
        open={showEstimateDialog}
        onClose={() => setShowEstimateDialog(false)}
        taskId={currentTask.taskSequence}
        storyPoints={currentTask.storyPoints}
      />

      <LabelsDialog
        open={showLabelsDialog}
        onClose={() => setShowLabelsDialog(false)}
        taskId={currentTask.taskSequence}
        labels={labels}
        suggestions={projectLabels}
      />
    </>
  );
};

export default ExtraDetails;
