import React from "react";

import * as project from "features/projects/styles/projectClasses";

import { projectTypes, templates } from "features/projects/data";
import type { ProjectDraft, ProjectOption } from "features/projects/types";

interface SummaryRowProps {
  label: string;
  option: ProjectOption | undefined;
  onChange: () => void;
}

// A choice from an earlier step, with a button that goes back to that step
const SummaryRow = ({ label, option, onChange }: SummaryRowProps) => {
  if (!option) {
    return null;
  }
  const Icon = option.icon;

  return (
    <div className={project.summaryRow}>
      <span className={project.summaryIcon} aria-hidden="true">
        <Icon />
      </span>
      <div className="flex-1 min-w-0">
        <p className={project.summaryLabel}>{label}</p>
        <p className={project.summaryValue}>{option.title}</p>
      </div>
      <button
        type="button"
        className={project.linkButton}
        onClick={onChange}
        aria-label={`Change ${label.toLowerCase()}`}
      >
        Change
      </button>
    </div>
  );
};

interface ProjectDetailsProps {
  details: ProjectDraft;
  nameError: string;
  onChange: (changes: Partial<ProjectDraft>) => void;
  /** Goes back to an earlier step of the wizard */
  onChangeStep: (step: number) => void;
}

// Step 3 of the Create project wizard: name and description, next to a summary of steps 1 and 2
const ProjectDetails = ({ details, nameError, onChange, onChangeStep }: ProjectDetailsProps) => {
  const template = templates.find((item) => item.value === details.projectTemplate);
  const type = projectTypes.find((item) => item.value === details.projectType);

  return (
    <div className={project.detailsGrid}>
      <div>
        <h2 className={project.stepTitle}>Add project details</h2>
        <p className={project.stepText}>Name your project and add a short description.</p>

        <div className={project.field}>
          <label htmlFor="project-name" className={project.label}>Project name</label>
          <input
            id="project-name"
            type="text"
            value={details.projectName}
            onChange={(e) => onChange({ projectName: e.target.value })}
            className={project.input}
            placeholder="e.g. Website redesign"
            autoComplete="off"
            autoFocus
            aria-invalid={!!nameError}
            aria-describedby={nameError ? "project-name-error" : undefined}
          />
          {nameError ? (
            <p id="project-name-error" className={project.error}>{nameError}</p>
          ) : null}
        </div>

        <div className={project.field}>
          <label htmlFor="project-description" className={project.label}>
            Description <span className={project.labelHint}>(optional)</span>
          </label>
          <textarea
            id="project-description"
            rows={4}
            value={details.projectDescription}
            onChange={(e) => onChange({ projectDescription: e.target.value })}
            className={project.textarea}
            placeholder="What is this project about?"
          />
        </div>
      </div>

      <aside className={project.summary}>
        <h3 className={project.summaryTitle}>Summary</h3>
        <SummaryRow label="Template" option={template} onChange={() => onChangeStep(0)} />
        <SummaryRow label="Managed by" option={type} onChange={() => onChangeStep(1)} />
      </aside>
    </div>
  );
};

export default ProjectDetails;
