import React, { useState } from "react";
import { Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiX } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import DueDateField, { isDueDateInputValid } from "features/tasks/components/DueDateField/DueDateField";
import PriorityPicker from "features/tasks/components/PriorityPicker/PriorityPicker";
import { useCreateSubtaskMutation } from "features/tasks/api/tasksApi";
import useCurrentProject from "features/projects/hooks/useCurrentProject";
import { toastOptions } from "features/tasks/data";
import { useAppSelector } from "app/hooks";

type Props = {
  open: boolean;
  onClose: () => void;
};

// Dialog that adds a subtask to the open task
const NewSubTask = ({ open, onClose }: Props) => {
  const { currentData: currentProject } = useCurrentProject();
  const parentTaskId = useAppSelector((state) => state.tasks.selectedTaskSequence);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [dueDate, setDueDate] = useState("");
  const [dueDateError, setDueDateError] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [createNewSubtask] = useCreateSubtaskMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    setTaskName("");
    setPriority("LOW");
    setDueDate("");
    setDueDateError("");
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
    if (!isDueDateInputValid(e.currentTarget)) {
      setDueDateError("Please enter a valid date");
      return;
    }

    setSaving(true);
    try {
      const resp = await createNewSubtask({
        projectId: currentProject!.projectIdentifier,
        parentTaskId: parentTaskId!,
        taskName: name,
        priority,
        status: "",
        dueDate,
      }).unwrap();
      enqueueSnackbar(resp.message || "Subtask created", { ...toastOptions, variant: "success" });
      handleClose();
    } catch (err) {
      console.log(err);
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
              in <span className="font-semibold uppercase">{parentTaskId}</span>
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
          <DueDateField
            id="new-subtask-due-date"
            label="Due date (optional)"
            value={dueDate}
            onChange={(value) => {
              setDueDate(value);
              setDueDateError("");
            }}
            error={dueDateError}
          />
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

export default NewSubTask;
