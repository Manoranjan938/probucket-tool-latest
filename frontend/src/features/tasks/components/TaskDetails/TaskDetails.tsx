import React, { useEffect, useState } from "react";
import { Menu, MenuItem, Skeleton, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import {
  FiCheck,
  FiChevronDown,
  FiEye,
  FiGitMerge,
  FiMaximize2,
  FiMinimize2,
  FiMoreHorizontal,
  FiPaperclip,
  FiShare2,
  FiX,
} from "react-icons/fi";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";

import * as task from "features/tasks/styles/taskClasses";

import SubTask from "features/tasks/components/SubTask/SubTask";
import ExtraDetails from "features/tasks/components/ExtraDetails/ExtraDetails";
import TaskActivity from "features/tasks/components/TaskActivity/TaskActivity";
import TaskStatusCompletion from "features/tasks/components/TaskStatusCompletion/TaskStatusCompletion";
import NewSubTask from "features/tasks/components/NewSubTask/NewSubTask";
import useUpdateTask from "features/tasks/hooks/useUpdateTask";
import useGetSubTasks from "features/tasks/hooks/useGetSubTasks";
import { setSubtaskList } from "features/tasks/store/taskAction";
import { taskStatuses, toastOptions } from "features/tasks/data";
import type { AppDispatch, RootState } from "app/store";
import type { Subtask } from "features/tasks/types";

export type DetailsView = "panel" | "modal";

type OwnProps = {
  /** The task to show; the store may still hold the previously opened task while this one loads */
  sequence: string;
  view: DetailsView;
  onToggleView: () => void;
  onClose: () => void;
  /** Called after the task changed, to reload it and the board */
  onChanged: () => void;
};

// Content of the task details side panel / modal
const TaskDetails = ({
  sequence,
  view,
  onToggleView,
  onClose,
  onChanged,
  task: currentTask,
  setSubtasks,
  allSubtask,
}: OwnProps & Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [description, setDescription] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [openSubtask, setOpenSubtask] = useState(false);
  const [updateTask] = useUpdateTask();
  const [, getSubtaskList] = useGetSubTasks();
  const { enqueueSnackbar } = useSnackbar();

  const loaded = currentTask.taskSequence === sequence;
  const status = taskStatuses[currentTask.status ?? ""] ?? taskStatuses.TODO;

  const loadSubtasks = async () => {
    try {
      const resp = await getSubtaskList(sequence);
      setSubtasks(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  // The previous task's subtasks are cleared first, so they never show under this task
  useEffect(() => {
    setSubtasks([]);
    loadSubtasks();
  }, [sequence]);

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
      });
      onChanged();
    } catch (err) {
      console.log(err);
      enqueueSnackbar("Couldn't change the status. Please try again.", { ...toastOptions, variant: "error" });
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSubtaskCreated = () => {
    loadSubtasks();
    onChanged();
  };

  const statusControl = (
    <>
      <button
        type="button"
        className={`${task.statusButton} ${status.soft} ${status.text}`}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        disabled={savingStatus}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
        aria-label={`Status: ${status.label}`}
      >
        {status.label}
        <FiChevronDown aria-hidden="true" />
      </button>
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

  const actions = (
    <div className={task.actionsRow}>
      {view === "panel" ? statusControl : null}
      {/* Attachments aren't wired up yet */}
      <button type="button" className={`${task.btnGhost} ${task.btnSmall}`}>
        <FiPaperclip aria-hidden="true" />
        Attach
      </button>
      <button type="button" className={`${task.btnGhost} ${task.btnSmall}`} onClick={() => setOpenSubtask(true)}>
        <FiGitMerge aria-hidden="true" />
        Create subtask
      </button>
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

  const details = <ExtraDetails onChanged={onChanged} />;
  const progress = <TaskStatusCompletion task={currentTask} />;
  const subtasks = <SubTask subtask={allSubtask} onAdd={() => setOpenSubtask(true)} />;

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
              <h2 className={task.taskTitle}>{currentTask.taskName}</h2>
              {actions}
              {descriptionSection}
              {subtasks}
              <TaskActivity />
            </div>
            <aside className={task.detailsSide}>
              <div>{statusControl}</div>
              {details}
              {progress}
            </aside>
          </div>
        )}
      </div>

      {openSubtask && (
        <NewSubTask open={openSubtask} onClose={() => setOpenSubtask(false)} onCreated={handleSubtaskCreated} />
      )}
    </div>
  );
};

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    setSubtasks: (data: Subtask[]) => dispatch(setSubtaskList(data)),
  };
}

const mapStateToProps = (state: RootState) => ({
  task: state.tasks.selectedTask,
  allSubtask: state.tasks.allSubtasks,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(TaskDetails);
