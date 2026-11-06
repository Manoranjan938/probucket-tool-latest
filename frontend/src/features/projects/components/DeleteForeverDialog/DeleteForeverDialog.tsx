import React, { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiAlertTriangle, FiX } from "react-icons/fi";

import * as project from "features/projects/styles/projectClasses";
import * as task from "features/tasks/styles/taskClasses";

import { useDeleteProjectForeverMutation } from "features/projects/api/projectsApi";
import { toastOptions } from "features/tasks/data";
import { getApiErrorMessage } from "shared/services/apiError";
import type { DeletedProject } from "features/projects/types";

interface DeleteForeverDialogProps {
  /** null while closed */
  item: DeletedProject | null;
  onClose: () => void;
}

// Lead only, from Recently deleted: removes the project and everything in it straight away.
// Typing the key makes sure the right project goes.
const DeleteForeverDialog = ({ item, onClose }: DeleteForeverDialogProps) => {
  const [typed, setTyped] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteForever] = useDeleteProjectForeverMutation();
  const { enqueueSnackbar } = useSnackbar();

  const key = item?.projectIdentifier ?? "";
  const confirmed = Boolean(key) && typed.trim().toUpperCase() === key.toUpperCase();

  useEffect(() => {
    if (item) {
      setTyped("");
      setError("");
      setDeleting(false);
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!item || !confirmed) {
      return;
    }
    setDeleting(true);
    try {
      await deleteForever(item.projectId).unwrap();
      enqueueSnackbar(`${item.projectName} deleted for good`, { ...toastOptions, variant: "success" });
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't delete the project. Please try again."));
      setDeleting(false);
    }
  };

  return (
    <Dialog
      open={item !== null}
      onClose={deleting ? undefined : onClose}
      PaperProps={{ className: task.dialogPaper }}
      aria-labelledby="delete-forever-title"
      aria-describedby="delete-forever-text"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className={task.dialogHeader}>
          <h2 id="delete-forever-title" className={task.dialogTitle}>Delete forever?</h2>
          <button type="button" className={task.iconButton} onClick={onClose} aria-label="Close" disabled={deleting}>
            <FiX />
          </button>
        </div>
        <div className={task.dialogBody}>
          <div id="delete-forever-text" className={project.deleteWarning}>
            <FiAlertTriangle className={project.deleteWarningIcon} aria-hidden="true" />
            <div>
              <p>
                <span className="font-semibold text-brand-ink capitalize">{item?.projectName}</span> will be removed
                with its tasks, comments, images, activity, notes and team list.
              </p>
              <p className="mt-2">Team members keep their accounts. This can't be undone.</p>
            </div>
          </div>
          <div className={task.field}>
            <label htmlFor="delete-forever-key" className={task.label}>
              Type <span className={project.detailKey}>{key}</span> to confirm
            </label>
            <input
              id="delete-forever-key"
              className={task.input}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              disabled={deleting}
              aria-describedby={error ? "delete-forever-error" : undefined}
              autoFocus
            />
            {error ? <p id="delete-forever-error" className={task.error} role="alert">{error}</p> : null}
          </div>
        </div>
        <div className={task.dialogFooter}>
          <button type="button" className={task.btnGhost} onClick={onClose} disabled={deleting}>Cancel</button>
          <button type="submit" className={task.btnDanger} disabled={!confirmed || deleting}>
            {deleting ? "Deleting…" : "Delete forever"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default DeleteForeverDialog;
