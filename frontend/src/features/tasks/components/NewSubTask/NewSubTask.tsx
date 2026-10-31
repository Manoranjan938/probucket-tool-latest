import React, { useState } from "react";
import { Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiX } from "react-icons/fi";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";

import * as task from "features/tasks/styles/taskClasses";

import PriorityPicker from "features/tasks/components/PriorityPicker/PriorityPicker";
import useCreateNewSubtask from "features/tasks/hooks/useCreateNewSubtask";
import { toastOptions } from "features/tasks/data";
import type { ApiError } from "shared/types";
import type { RootState } from "app/store";

type OwnProps = {
  open: boolean;
  onClose: () => void;
  /** Called after the subtask is created, to reload the subtasks */
  onCreated: () => void;
};

// Dialog that adds a subtask to the open task
const NewSubTask = ({ open, onClose, onCreated, currentProject, currentTask }: OwnProps & Props) => {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [createNewSubtask] = useCreateNewSubtask();
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    setTaskName("");
    setPriority("LOW");
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = taskName.trim();
    if (!name) {
      setError("Please describe the subtask");
      return;
    }

    setSaving(true);
    try {
      const resp = await createNewSubtask({
        projectId: currentProject.projectIdentifier!,
        parentTaskId: currentTask.taskSequence!,
        taskName: name,
        priority,
        status: "",
      });
      enqueueSnackbar(resp.data || "Subtask created", { ...toastOptions, variant: "success" });
      onCreated();
      handleClose();
    } catch (err) {
      console.log((err as ApiError).response);
      enqueueSnackbar("Couldn't create the subtask. Please try again.", { ...toastOptions, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ className: task.dialogPaper }} aria-labelledby="new-subtask-title">
      <form onSubmit={handleSubmit} noValidate>
        <div className={task.dialogHeader}>
          <div>
            <h2 id="new-subtask-title" className={task.dialogTitle}>New subtask</h2>
            <p className="text-[13px] text-brand-muted">
              in <span className="font-semibold uppercase">{currentTask.taskSequence}</span>
            </p>
          </div>
          <button type="button" className={task.iconButton} onClick={handleClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className={task.dialogBody}>
          <div className={task.field}>
            <label htmlFor="new-subtask-name" className={task.label}>Subtask</label>
            <textarea
              id="new-subtask-name"
              rows={3}
              value={taskName}
              onChange={(e) => {
                setTaskName(e.target.value);
                setError("");
              }}
              className={task.textarea}
              placeholder="What needs to be done?"
              autoFocus
              aria-invalid={!!error}
              aria-describedby={error ? "new-subtask-error" : undefined}
            />
            {error ? <p id="new-subtask-error" className={task.error}>{error}</p> : null}
          </div>
          <div className={task.field}>
            <span className={task.label}>Priority</span>
            <PriorityPicker name="new-subtask-priority" value={priority} onChange={setPriority} />
          </div>
        </div>

        <div className={task.dialogFooter}>
          <button type="button" className={task.btnGhost} onClick={handleClose}>Cancel</button>
          <button type="submit" className={task.btnPrimary} disabled={saving}>
            {saving ? "Adding…" : "Add subtask"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentProject: state.project.project,
  currentTask: state.tasks.selectedTask,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(NewSubTask);
