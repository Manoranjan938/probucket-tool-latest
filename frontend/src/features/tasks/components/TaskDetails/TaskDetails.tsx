import React, { useEffect, useState } from "react";
import { Menu, MenuItem, Skeleton, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiCheck, FiChevronDown, FiCornerLeftUp, FiEye, FiGitMerge, FiMaximize2, FiMinimize2, FiMoreHorizontal, FiPaperclip, FiShare2, FiX } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import SubTask from "features/tasks/components/SubTask/SubTask";
import ExtraDetails from "features/tasks/components/ExtraDetails/ExtraDetails";
import TaskActivity from "features/tasks/components/TaskActivity/TaskActivity";
import TaskStatusCompletion from "features/tasks/components/TaskStatusCompletion/TaskStatusCompletion";
import NewSubTask from "features/tasks/components/NewSubTask/NewSubTask";
import { useGetSubtasksQuery, useGetTaskDetailsQuery, useUpdateTaskMutation } from "features/tasks/api/tasksApi";
import { taskStatuses, toastOptions } from "features/tasks/data";
import { getApiErrorMessage } from "shared/services/apiError";
import type { TaskDetails as TaskDetailsData } from "features/tasks/types";

export type DetailsView = "panel" | "modal";

type Props = {
  /** The task to show */
  sequence: string;
  view: DetailsView;
  onToggleView: () => void;
  onClose: () => void;
  /** Shows the given task instead of this one */
  onOpenTask: (sequence: string) => void;
};

// Content of the task details side panel / modal
const TaskDetails = ({
  sequence,
  view,
  onToggleView,
  onClose,
  onOpenTask,
}: Props) => {
  // Both are undefined while this task loads, so the previous task's never show; every change reloads them
  const { currentData: loadedTask } = useGetTaskDetailsQuery(sequence);
  const { currentData: allSubtask = [] } = useGetSubtasksQuery(sequence);
  const currentTask: Partial<TaskDetailsData> = loadedTask ?? {};
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [description, setDescription] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [openSubtask, setOpenSubtask] = useState(false);
  const [updateTask] = useUpdateTaskMutation();
  const { enqueueSnackbar } = useSnackbar();

  const loaded = Boolean(loadedTask);
  const isSubtask = Boolean(currentTask.subtask);
  const status = taskStatuses[currentTask.status ?? ""] ?? taskStatuses.TODO;
  // The status only changes once someone owns the task; the backend refuses it too.
  // The details send "NA" for an unassigned task.
  const assigned = Boolean(currentTask.assignee) && currentTask.assignee !== "NA";
  const lockedHint = "Assign someone to change the status";

  useEffect(() => {
    setDescription(currentTask.taskDesc ?? "");
  }, [currentTask.taskSequence, currentTask.taskDesc]);

  const changeStatus = async (newStatus: string) => {
    setAnchorEl(null);
    if (newStatus === currentTask.status) {
      return;
    }
    setSavingStatus(true);
    try {
      await updateTask({
        taskId: currentTask.taskSequence!,
        status: newStatus,
        assignee: currentTask.assignee!,
        priority: currentTask.priority!,
        description: currentTask.taskDesc!,
      }).unwrap();
    } catch (err) {
      console.log(err);
      enqueueSnackbar(getApiErrorMessage(err, "Couldn't change the status. Please try again."), { ...toastOptions, variant: "error" });
    } finally {
      setSavingStatus(false);
    }
  };

  const statusControl = (
    <>
      {/* The span lets the tooltip show on the disabled button; above it, so it doesn't cover the hint below */}
      <Tooltip title={assigned ? "" : lockedHint} placement="top">
        <span className="inline-flex">
          <button
            type="button"
            className={`${task.statusButton} ${status.soft} ${status.text}`}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            disabled={savingStatus || !assigned}
            aria-haspopup="menu"
            aria-expanded={Boolean(anchorEl)}
            aria-label={`Status: ${status.label}`}
            aria-describedby={assigned ? undefined : "status-hint"}
          >
            {status.label}
            <FiChevronDown aria-hidden="true" />
          </button>
        </span>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {Object.entries(taskStatuses).map(([value, style]) => (
          <MenuItem key={value} onClick={() => changeStatus(value)} selected={value === currentTask.status}>
            <span className={`mr-2.5 w-2.5 h-2.5 rounded-[50%] ${style.solid}`} aria-hidden="true" />
            {style.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  // Under the status button: the actions row in the panel, the side column in the modal
  const statusNote = assigned ? null : (
    <p id="status-hint" className={task.statusHint}>{lockedHint}</p>
  );

  const actionsRow = (
    <div className={task.actionsRow}>
      {view === "panel" ? statusControl : null}
      {/* Attachments aren't wired up yet */}
      <button type="button" className={`${task.btnGhost} ${task.btnSmall}`}>
        <FiPaperclip aria-hidden="true" />
        Attach
      </button>
      {isSubtask ? null : (
        <button type="button" className={`${task.btnGhost} ${task.btnSmall}`} onClick={() => setOpenSubtask(true)}>
          <FiGitMerge aria-hidden="true" />
          Create subtask
        </button>
      )}
    </div>
  );

  const actions = (
    <div className="flex flex-col gap-1.5">
      {actionsRow}
      {view === "panel" ? statusNote : null}
    </div>
  );

  const descriptionSection = (
    <section className={task.section}>
      <label htmlFor="task-description" className={task.sectionTitle}>Description</label>
      <textarea
        id="task-description"
        className={task.textarea}
        placeholder="Add a description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {/* Saving the description isn't wired up yet */}
      <div className={task.formActions}>
        <button type="button" className={`${task.btnPrimary} ${task.btnSmall}`}>Save</button>
        <button type="button" className={`${task.btnGhost} ${task.btnSmall}`}>Cancel</button>
      </div>
    </section>
  );

  const details = <ExtraDetails />;
  // Subtasks can't have their own, so these only show on a subtask for data from before that rule
  const showSubtasks = !isSubtask || allSubtask.length > 0;
  const progress = showSubtasks ? <TaskStatusCompletion task={currentTask} /> : null;
  const subtasks = showSubtasks ? (
    <SubTask subtask={allSubtask} onAdd={isSubtask ? undefined : () => setOpenSubtask(true)} />
  ) : null;
  const parentLink =
    isSubtask && currentTask.parentTaskId ? (
      <button
        type="button"
        className={`${task.linkButton} ${task.parentLink}`}
        onClick={() => onOpenTask(currentTask.parentTaskId!)}
      >
        <FiCornerLeftUp aria-hidden="true" />
        Subtask of {currentTask.parentTaskId}
      </button>
    ) : null;

  return (
    <div className={task.details}>
      <div className={task.detailsHeader}>
        <span className={task.detailsKey}>
          <span className={task.taskTypeIcon} aria-hidden="true"><FiCheck /></span>
          {sequence}
        </span>
        <div className={task.detailsActions}>
          {/* Watch, share and more aren't wired up yet */}
          <Tooltip title="Watch">
            <button type="button" className={task.iconButton} aria-label="Watch"><FiEye /></button>
          </Tooltip>
          <Tooltip title="Share">
            <button type="button" className={task.iconButton} aria-label="Share"><FiShare2 /></button>
          </Tooltip>
          <Tooltip title="More">
            <button type="button" className={task.iconButton} aria-label="More"><FiMoreHorizontal /></button>
          </Tooltip>
          <span className={task.detailsDivider} aria-hidden="true" />
          <Tooltip title={view === "panel" ? "Expand" : "Show as side panel"}>
            <button
              type="button"
              className={`${task.iconButton} max-[640px]:hidden`}
              onClick={onToggleView}
              aria-label={view === "panel" ? "Expand" : "Show as side panel"}
            >
              {view === "panel" ? <FiMaximize2 /> : <FiMinimize2 />}
            </button>
          </Tooltip>
          <Tooltip title="Close">
            <button type="button" className={task.iconButton} onClick={onClose} aria-label="Close"><FiX /></button>
          </Tooltip>
        </div>
      </div>

      <div className={task.detailsBody}>
        {!loaded ? (
          <div className={task.detailsGridPanel} aria-busy="true">
            <Skeleton variant="text" sx={{ fontSize: 22 }} width="80%" />
            <Skeleton variant="rounded" height={36} width={240} sx={{ borderRadius: "10px" }} />
            <Skeleton variant="rounded" height={96} sx={{ borderRadius: "10px" }} />
            <Skeleton variant="rounded" height={140} sx={{ borderRadius: "12px" }} />
          </div>
        ) : view === "panel" ? (
          <div className={task.detailsGridPanel}>
            {parentLink}
            <h2 className={task.taskTitle}>{currentTask.taskName}</h2>
            {actions}
            {details}
            {descriptionSection}
            {subtasks}
            {progress}
            <TaskActivity />
          </div>
        ) : (
          <div className={task.detailsGridModal}>
            <div className={task.detailsMain}>
              {parentLink}
              <h2 className={task.taskTitle}>{currentTask.taskName}</h2>
              {actions}
              {descriptionSection}
              {subtasks}
              <TaskActivity />
            </div>
            <aside className={task.detailsSide}>
              <div className="flex flex-col items-start gap-1.5">
                {statusControl}
                {statusNote}
              </div>
              {details}
              {progress}
            </aside>
          </div>
        )}
      </div>

      {openSubtask && (
        <NewSubTask open={openSubtask} onClose={() => setOpenSubtask(false)} />
      )}
    </div>
  );
};

export default TaskDetails;
