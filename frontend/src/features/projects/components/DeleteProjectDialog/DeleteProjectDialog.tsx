import React, { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FiAlertTriangle, FiX } from "react-icons/fi";

import * as project from "features/projects/styles/projectClasses";
import * as task from "features/tasks/styles/taskClasses";

import { useDeleteProjectMutation } from "features/projects/api/projectsApi";
import { PROJECT_RETENTION_DAYS } from "features/projects/data";
import { toastOptions } from "features/tasks/data";
import { getApiErrorMessage } from "shared/services/apiError";
import { useAppSelector } from "app/hooks";
import type { Project } from "features/projects/types";

interface DeleteProjectDialogProps {
  open: boolean;
  onClose: () => void;
  currentProject: Project;
}

// Lead only. The project is hidden from everyone and can be restored from the Projects page for a while.
// Typing the key makes sure the right project is being deleted.
const DeleteProjectDialog = ({ open, onClose, currentProject }: DeleteProjectDialogProps) => {
  const [typed, setTyped] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteProject] = useDeleteProjectMutation();
  const userId = useAppSelector((state) => state.security.user.id);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const key = currentProject.projectIdentifier;
  const confirmed = typed.trim().toUpperCase() === key.toUpperCase();

  useEffect(() => {
    if (open) {
      setTyped("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirmed || !userId) {
      return;
    }
    setDeleting(true);
    try {
      await deleteProject({ projectId: currentProject.projectId, userId }).unwrap();
      enqueueSnackbar(`${currentProject.projectName} deleted. You can restore it below.`, {
        ...toastOptions,
        variant: "success",
      });
      navigate("/projects", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't delete the project. Please try again."));
      setDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
      PaperProps={{ className: task.dialogPaper }}
      aria-labelledby="delete-project-title"
      aria-describedby="delete-project-text"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className={task.dialogHeader}>
          <h2 id="delete-project-title" className={task.dialogTitle}>Delete project?</h2>
          <button type="button" className={task.iconButton} onClick={onClose} aria-label="Close" disabled={deleting}>
            <FiX />
          </button>
        </div>
        <div className={task.dialogBody}>
          <div id="delete-project-text" className={project.deleteWarning}>
            <FiAlertTriangle className={project.deleteWarningIcon} aria-hidden="true" />
            <div>
              <p>
                <span className="font-semibold text-brand-ink">{currentProject.projectName}</span> and everything in it
                will be hidden from everyone on the project straight away.
              </p>
              <p className="mt-2">
                You can restore it from Recently deleted on the Projects page for {PROJECT_RETENTION_DAYS} days. After
                that it's deleted for good.
              </p>
            </div>
          </div>
          <div className={task.field}>
            <label htmlFor="delete-project-key" className={task.label}>
              Type <span className={project.detailKey}>{key}</span> to confirm
            </label>
            <input
              id="delete-project-key"
              className={task.input}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              disabled={deleting}
              aria-describedby={error ? "delete-project-error" : undefined}
              autoFocus
            />
            {error ? <p id="delete-project-error" className={task.error} role="alert">{error}</p> : null}
          </div>
        </div>
        <div className={task.dialogFooter}>
          <button type="button" className={task.btnGhost} onClick={onClose} disabled={deleting}>Cancel</button>
          <button type="submit" className={task.btnDanger} disabled={!confirmed || deleting}>
            {deleting ? "Deleting…" : "Delete project"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default DeleteProjectDialog;
