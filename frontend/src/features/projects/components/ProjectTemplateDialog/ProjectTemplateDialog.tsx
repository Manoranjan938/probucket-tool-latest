import React, { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiInfo, FiX } from "react-icons/fi";

import * as project from "features/projects/styles/projectClasses";
import * as task from "features/tasks/styles/taskClasses";

import OptionCard from "features/projects/components/OptionCard/OptionCard";
import { useUpdateProjectTemplateMutation } from "features/projects/api/projectsApi";
import { templateChangeNote, templateOf, templates } from "features/projects/data";
import { toastOptions } from "features/tasks/data";
import { getApiErrorMessage } from "shared/services/apiError";

interface ProjectTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  /** The project's current template */
  template: string | undefined;
}

// Lead only: switch the project between the three templates of the Create project wizard
const ProjectTemplateDialog = ({ open, onClose, projectId, template }: ProjectTemplateDialogProps) => {
  const current = templateOf(template).value;
  const [value, setValue] = useState(current);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [updateTemplate] = useUpdateProjectTemplateMutation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      setValue(current);
      setError("");
    }
  }, [open, current]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateTemplate({ projectId, projectTemplate: value }).unwrap();
      enqueueSnackbar(`Template changed to ${templateOf(value).title}`, { ...toastOptions, variant: "success" });
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't change the template. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      PaperProps={{ className: project.templateDialogPaper }}
      aria-labelledby="template-dialog-title"
      aria-describedby="template-dialog-text"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className={task.dialogHeader}>
          <h2 id="template-dialog-title" className={task.dialogTitle}>Change template</h2>
          <button type="button" className={task.iconButton} onClick={onClose} aria-label="Close" disabled={saving}>
            <FiX />
          </button>
        </div>
        <div className={task.dialogBody}>
          <p id="template-dialog-text" className="mb-4 text-[14px]">
            The template decides whether new items in this project are tasks, bugs or both.
          </p>
          <div role="radiogroup" aria-labelledby="template-dialog-title" className={project.optionGrid}>
            {templates.map((option) => (
              <OptionCard
                key={option.value}
                name="settings-project-template"
                option={option}
                checked={value === option.value}
                onChange={setValue}
              />
            ))}
          </div>
          {value !== current ? (
            <p className={project.templateNote} aria-live="polite">
              <FiInfo className={project.templateNoteIcon} aria-hidden="true" />
              <span>{templateChangeNote[value]}</span>
            </p>
          ) : null}
          {error ? <p className={project.error} role="alert">{error}</p> : null}
        </div>
        <div className={task.dialogFooter}>
          <button type="button" className={task.btnGhost} onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className={task.btnPrimary} disabled={saving || value === current}>
            {saving ? "Saving…" : "Change template"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default ProjectTemplateDialog;
