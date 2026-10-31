import React, { useState } from "react";
import { Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiX } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import PriorityPicker from "features/tasks/components/PriorityPicker/PriorityPicker";
import useCreateTask from "features/tasks/hooks/useCreateTask";
import { toastOptions } from "features/tasks/data";

interface NewTaskProps {
  open: boolean;
  onClose: () => void;
  /** Called after the task is created, to reload the board */
  onCreated: () => void;
  /** projectIdentifier – the "name" query parameter */
  projectIdentifier: string | null;
}

// Dialog that creates a task in the To do column
const NewTask = ({ open, onClose, onCreated, projectIdentifier }: NewTaskProps) => {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [createProjectTask] = useCreateTask();
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
      setError("Please describe the task");
      return;
    }

    setSaving(true);
    try {
      await createProjectTask({
        projectIdentifier: projectIdentifier!,
        taskName: name,
        priority,
        sprintId: "",
        status: "",
      });
      enqueueSnackbar("Task created", { ...toastOptions, variant: "success" });
      onCreated();
      handleClose();
    } catch (err) {
      console.log(err);
      enqueueSnackbar("Couldn't create the task. Please try again.", { ...toastOptions, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ className: task.dialogPaper }} aria-labelledby="new-task-title">
      <form onSubmit={handleSubmit} noValidate>
        <div className={task.dialogHeader}>
          <h2 id="new-task-title" className={task.dialogTitle}>New task</h2>
          <button type="button" className={task.iconButton} onClick={handleClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className={task.dialogBody}>
          <div className={task.field}>
            <label htmlFor="new-task-name" className={task.label}>Task</label>
            <textarea
              id="new-task-name"
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
              aria-describedby={error ? "new-task-error" : undefined}
            />
            {error ? <p id="new-task-error" className={task.error}>{error}</p> : null}
          </div>
          <div className={task.field}>
            <span className={task.label}>Priority</span>
            <PriorityPicker name="new-task-priority" value={priority} onChange={setPriority} />
          </div>
        </div>

        <div className={task.dialogFooter}>
          <button type="button" className={task.btnGhost} onClick={handleClose}>Cancel</button>
          <button type="submit" className={task.btnPrimary} disabled={saving}>
            {saving ? "Creating…" : "Create task"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default NewTask;
