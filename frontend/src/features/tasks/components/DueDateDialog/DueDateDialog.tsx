import React, { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiX } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import DueDateField, { isDueDateInputValid } from "features/tasks/components/DueDateField/DueDateField";
import { useUpdateDueDateMutation } from "features/tasks/api/tasksApi";
import { toastOptions } from "features/tasks/data";
import { getApiErrorMessage } from "shared/services/apiError";

interface DueDateDialogProps {
  open: boolean;
  onClose: () => void;
  taskId: string | undefined;
  /** The current due date, yyyy-mm-dd */
  dueDate: string | null | undefined;
}

// Dialog that sets, changes or removes a task's due date
const DueDateDialog = ({ open, onClose, taskId, dueDate }: DueDateDialogProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [updateDueDate] = useUpdateDueDateMutation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      setValue(dueDate ?? "");
      setError("");
    }
  }, [open, dueDate]);

  const save = async (newDate: string) => {
    setSaving(true);
    try {
      await updateDueDate({ taskId: taskId!, dueDate: newDate }).unwrap();
      enqueueSnackbar(newDate ? "Due date updated" : "Due date removed", { ...toastOptions, variant: "success" });
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't save the due date. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isDueDateInputValid(e.currentTarget) || !value) {
      setError("Please enter a valid date");
      return;
    }
    save(value);
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: task.dialogPaper }} aria-labelledby="due-date-dialog-title">
      <form onSubmit={handleSubmit} noValidate>
        <div className={task.dialogHeader}>
          <h2 id="due-date-dialog-title" className={task.dialogTitle}>{dueDate ? "Change due date" : "Set due date"}</h2>
          <button type="button" className={task.iconButton} onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>
        <div className={task.dialogBody}>
          <DueDateField
            id="due-date-input"
            label="Due date"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
              setError("");
            }}
            error={error}
          />
        </div>
        <div className={task.dialogFooter}>
          {dueDate ? (
            <button type="button" className={`${task.linkButton} mr-auto`} onClick={() => save("")} disabled={saving}>
              Remove due date
            </button>
          ) : null}
          <button type="button" className={task.btnGhost} onClick={onClose}>Cancel</button>
          <button type="submit" className={task.btnPrimary} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default DueDateDialog;
