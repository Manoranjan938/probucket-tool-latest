import React, { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiX } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import StoryPointsPicker from "features/tasks/components/StoryPointsPicker/StoryPointsPicker";
import { useUpdateEstimateMutation } from "features/tasks/api/tasksApi";
import { toastOptions } from "features/tasks/data";
import { getApiErrorMessage } from "shared/services/apiError";

interface EstimateDialogProps {
  open: boolean;
  onClose: () => void;
  taskId: string | undefined;
  storyPoints: number | null | undefined;
}

// Dialog that sets, changes or removes a task's estimate in story points
const EstimateDialog = ({ open, onClose, taskId, storyPoints }: EstimateDialogProps) => {
  const [value, setValue] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [updateEstimate] = useUpdateEstimateMutation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      setValue(storyPoints ?? null);
      setError("");
    }
  }, [open, storyPoints]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateEstimate({ taskId: taskId!, storyPoints: value }).unwrap();
      enqueueSnackbar(value !== null ? "Estimate updated" : "Estimate removed", { ...toastOptions, variant: "success" });
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't save the estimate. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: task.dialogPaper }} aria-labelledby="estimate-dialog-title">
      <form onSubmit={handleSubmit} noValidate>
        <div className={task.dialogHeader}>
          <h2 id="estimate-dialog-title" className={task.dialogTitle}>{storyPoints ? "Change estimate" : "Set estimate"}</h2>
          <button type="button" className={task.iconButton} onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>
        <div className={task.dialogBody}>
          <div className={task.field}>
            <span className={task.label}>Story points</span>
            <StoryPointsPicker name="estimate-points" value={value} onChange={setValue} />
            {error ? <p className={task.error}>{error}</p> : null}
          </div>
        </div>
        <div className={task.dialogFooter}>
          <button type="button" className={task.btnGhost} onClick={onClose}>Cancel</button>
          <button type="submit" className={task.btnPrimary} disabled={saving || value === (storyPoints ?? null)}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default EstimateDialog;
