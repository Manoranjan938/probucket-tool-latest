import React, { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiX } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import DueDateField, { isDueDateInputValid } from "features/tasks/components/DueDateField/DueDateField";
import { useUpdateDueDateMutation, useUpdateStartDateMutation } from "features/tasks/api/tasksApi";
import { datesClash, DUE_BEFORE_START, START_AFTER_DUE, toastOptions } from "features/tasks/data";
import { getApiErrorMessage } from "shared/services/apiError";

export type TaskDateKind = "due" | "start";

const copy: Record<TaskDateKind, { name: string; title: string; clash: string }> = {
  due: { name: "Due date", title: "due date", clash: DUE_BEFORE_START },
  start: { name: "Start date", title: "start date", clash: START_AFTER_DUE },
};

interface TaskDateDialogProps {
  kind: TaskDateKind;
  open: boolean;
  onClose: () => void;
  taskId: string | undefined;
  /** The date being changed, yyyy-mm-dd */
  date: string | null | undefined;
  /** The task's other date: its due date when the start date changes, and the other way round */
  otherDate: string | null | undefined;
}

// Dialog that sets, changes or removes a task's due date or start date. The start date can't be after the due date.
const TaskDateDialog = ({ kind, open, onClose, taskId, date, otherDate }: TaskDateDialogProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [updateDueDate] = useUpdateDueDateMutation();
  const [updateStartDate] = useUpdateStartDateMutation();
  const { enqueueSnackbar } = useSnackbar();
  const { name, title, clash } = copy[kind];

  useEffect(() => {
    if (open) {
      setValue(date ?? "");
      setError("");
    }
  }, [open, date]);

  const save = async (newDate: string) => {
    setSaving(true);
    try {
      await (kind === "due"
        ? updateDueDate({ taskId: taskId!, dueDate: newDate })
        : updateStartDate({ taskId: taskId!, startDate: newDate })
      ).unwrap();
      enqueueSnackbar(newDate ? `${name} updated` : `${name} removed`, { ...toastOptions, variant: "success" });
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, `Couldn't save the ${title}. Please try again.`));
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
    if (kind === "due" ? datesClash(otherDate, value) : datesClash(value, otherDate)) {
      setError(clash);
      return;
    }
    save(value);
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: task.dialogPaper }} aria-labelledby="task-date-dialog-title">
      <form onSubmit={handleSubmit} noValidate>
        <div className={task.dialogHeader}>
          <h2 id="task-date-dialog-title" className={task.dialogTitle}>{date ? `Change ${title}` : `Set ${title}`}</h2>
          <button type="button" className={task.iconButton} onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>
        <div className={task.dialogBody}>
          <DueDateField
            id="task-date-input"
            label={name}
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
              setError("");
            }}
            error={error}
          />
        </div>
        <div className={task.dialogFooter}>
          {date ? (
            <button type="button" className={`${task.linkButton} mr-auto`} onClick={() => save("")} disabled={saving}>
              Remove {title}
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

export default TaskDateDialog;
