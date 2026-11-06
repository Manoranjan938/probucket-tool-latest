import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

import * as project from "features/projects/styles/projectClasses";

import ProjectTemplateDialog from "features/projects/components/ProjectTemplateDialog/ProjectTemplateDialog";
import { useUpdateProjectMutation } from "features/projects/api/projectsApi";
import { templateOf } from "features/projects/data";
import { formatDate, toastOptions } from "features/tasks/data";
import { getApiErrorMessage } from "shared/services/apiError";
import type { Project } from "features/projects/types";

type Props = {
  currentProject: Project;
  /** Only the lead can rename the project; everyone else sees the name */
  isLead: boolean;
};

// The project's name and details
const ProjectGeneralCard = ({ currentProject, isLead }: Props) => {
  const [name, setName] = useState(currentProject.projectName ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [updateProject] = useUpdateProjectMutation();
  const { enqueueSnackbar } = useSnackbar();

  const trimmedName = name.trim();
  const created = formatDate(currentProject.createdOn);

  useEffect(() => {
    setName(currentProject.projectName ?? "");
  }, [currentProject.projectId, currentProject.projectName]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!trimmedName) {
      setError("Enter a project name.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      // Updates the cached project, so the sidebar and the other pages show the new name too
      await updateProject({ projectId: currentProject.projectId, projectName: trimmedName }).unwrap();
      enqueueSnackbar("Project renamed", { ...toastOptions, variant: "success" });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, "Couldn't rename the project. Please try again."), {
        ...toastOptions,
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={project.settingsCard} aria-labelledby="settings-general-title">
      <div className={project.settingsCardHeader}>
        <div>
          <h2 id="settings-general-title" className={project.settingsCardTitle}>General</h2>
          <p className={project.settingsCardText}>
            {isLead ? "The project's name and details." : "Only the project lead can change these settings."}
          </p>
        </div>
      </div>

      {isLead ? (
        <form className={project.settingsForm} onSubmit={handleSubmit} noValidate>
          <span className={project.settingsAvatar} aria-hidden="true">
            {(trimmedName || currentProject.projectName)?.substring(0, 1)}
          </span>
          <div className={project.settingsField}>
            <label htmlFor="settings-project-name" className={project.label}>Project name</label>
            <div className={project.settingsFieldRow}>
              <input
                id="settings-project-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={project.input}
                autoComplete="off"
                disabled={saving}
                aria-invalid={Boolean(error)}
                aria-describedby="settings-project-name-note"
              />
              <button
                type="submit"
                className={project.settingsButton}
                disabled={saving || trimmedName === currentProject.projectName}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
            {error ? (
              <p id="settings-project-name-note" className={project.error}>{error}</p>
            ) : (
              <p id="settings-project-name-note" className={project.settingsHint}>
                The project key and task IDs stay the same.
              </p>
            )}
          </div>
        </form>
      ) : (
        <div className={project.settingsForm}>
          <span className={project.settingsAvatar} aria-hidden="true">
            {currentProject.projectName?.substring(0, 1)}
          </span>
          <p className={project.settingsName} title={currentProject.projectName}>{currentProject.projectName}</p>
        </div>
      )}

      <dl className={project.detailList}>
        <div className={project.detailRow}>
          <dt className={project.detailLabel}>Key</dt>
          <dd className={project.detailValue}>
            <span className={project.detailKey}>{currentProject.projectIdentifier}</span>
          </dd>
        </div>
        <div className={project.detailRow}>
          <dt className={project.detailLabel}>Type</dt>
          <dd className={project.detailValue}>{currentProject.projectType}</dd>
        </div>
        <div className={project.detailRow}>
          <dt className={project.detailLabel}>Template</dt>
          <dd className={`${project.detailValue} ${project.detailValueWithAction}`}>
            <span className="truncate">{templateOf(currentProject.projectTemplate).title}</span>
            {isLead ? (
              <button
                type="button"
                className={project.settingsButtonGhost}
                onClick={() => setTemplateOpen(true)}
                aria-label="Change template"
              >
                Change
              </button>
            ) : null}
          </dd>
        </div>
        <div className={project.detailRow}>
          <dt className={project.detailLabel}>Lead</dt>
          <dd className={project.detailValue}>{currentProject.leadBy}</dd>
        </div>
        {created ? (
          <div className={project.detailRow}>
            <dt className={project.detailLabel}>Created</dt>
            <dd className={project.detailValue}>{created}</dd>
          </div>
        ) : null}
      </dl>

      {isLead ? (
        <ProjectTemplateDialog
          open={templateOpen}
          onClose={() => setTemplateOpen(false)}
          projectId={currentProject.projectId}
          template={currentProject.projectTemplate}
        />
      ) : null}
    </section>
  );
};

export default ProjectGeneralCard;
