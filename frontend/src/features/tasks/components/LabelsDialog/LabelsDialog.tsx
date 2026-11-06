import React, { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiX } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import LabelsField from "features/tasks/components/LabelsField/LabelsField";
import { useUpdateLabelsMutation } from "features/tasks/api/tasksApi";
import { toastOptions } from "features/tasks/data";
import { getApiErrorMessage } from "shared/services/apiError";

interface LabelsDialogProps {
  open: boolean;
  onClose: () => void;
  taskId: string | undefined;
  labels: string[];
  /** Labels the project already uses */
  suggestions: string[];
}

// Dialog that adds and removes a task's labels, saved together
const LabelsDialog = ({ open, onClose, taskId, labels, suggestions }: LabelsDialogProps) => {
  const [value, setValue] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [updateLabels] = useUpdateLabelsMutation();
  const { enqueueSnackbar } = useSnackbar();

  // The list is a new array on every render, so its contents decide when to start again
  const savedLabels = labels.join("\n");
  useEffect(() => {
    if (open) {
      setValue(savedLabels ? savedLabels.split("\n") : []);
      setError("");
    }
  }, [open, savedLabels]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateLabels({ taskId: taskId!, labels: value }).unwrap();
      enqueueSnackbar("Labels updated", { ...toastOptions, variant: "success" });
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't save the labels. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: task.dialogPaper }} aria-labelledby="labels-dialog-title">
      <form onSubmit={handleSubmit} noValidate>
        <div className={task.dialogHeader}>
          <h2 id="labels-dialog-title" className={task.dialogTitle}>Edit labels</h2>
          <button type="button" className={task.iconButton} onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>
        <div className={task.dialogBody}>
          <div className={task.field}>
            <label htmlFor="labels-input" className={task.label}>Labels</label>
            <LabelsField id="labels-input" value={value} onChange={setValue} suggestions={suggestions} />
            {error ? <p className={task.error}>{error}</p> : null}
          </div>
        </div>
        <div className={task.dialogFooter}>
          <button type="button" className={task.btnGhost} onClick={onClose}>Cancel</button>
          <button type="submit" className={task.btnPrimary} disabled={saving || value.join("\n") === savedLabels}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default LabelsDialog;
