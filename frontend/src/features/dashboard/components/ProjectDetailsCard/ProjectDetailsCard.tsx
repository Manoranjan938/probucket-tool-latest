import React from "react";
import { Skeleton } from "@mui/material";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import { formatDate } from "features/tasks/data";
import type { Project } from "features/projects/types";

interface ProjectDetailsCardProps {
  /** undefined until the sidebar has loaded this project */
  project: Partial<Project> | undefined;
  /** Team dashboard only; undefined hides the row */
  memberCount?: number;
}

// The project's key, type, lead, created date and, on a team project, its number of members
const ProjectDetailsCard = ({ project, memberCount }: ProjectDetailsCardProps) => {
  const created = formatDate(project?.createdOn);

  return (
    <section className={dashboard.card} aria-labelledby="project-details-title">
      <div className={dashboard.cardHeader}>
        <h2 id="project-details-title" className={dashboard.cardTitle}>Project details</h2>
      </div>

      {project === undefined ? (
        <div aria-busy="true">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} variant="text" sx={{ fontSize: 14, my: "6px" }} />
          ))}
        </div>
      ) : (
        <dl className={dashboard.detailList}>
          <div className={dashboard.detailRow}>
            <dt>Key</dt>
            <dd className={dashboard.detailKey}>{project.projectIdentifier}</dd>
          </div>
          <div className={dashboard.detailRow}>
            <dt>Type</dt>
            <dd className={dashboard.detailValue}>{project.projectType}</dd>
          </div>
          <div className={dashboard.detailRow}>
            <dt>Lead</dt>
            <dd className={dashboard.detailValue} title={project.leadBy}>{project.leadBy}</dd>
          </div>
          {created ? (
            <div className={dashboard.detailRow}>
              <dt>Created</dt>
              <dd className={dashboard.detailValue}>{created}</dd>
            </div>
          ) : null}
          {memberCount !== undefined ? (
            <div className={dashboard.detailRow}>
              <dt>Team members</dt>
              <dd className={dashboard.detailValue}>{memberCount}</dd>
            </div>
          ) : null}
        </dl>
      )}
    </section>
  );
};

export default ProjectDetailsCard;
