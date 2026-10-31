import React from "react";
import { Link } from "react-router-dom";
import { FaFolderOpen, FaPlus } from "react-icons/fa";

import * as project from "features/projects/styles/projectClasses";

interface NoProjectsProps {
  /** Team members can't create projects, they are added to them by a team admin */
  canCreate: boolean;
}

// Shown on the Projects page when the user has no projects
const NoProjects = ({ canCreate }: NoProjectsProps) => {
  return (
    <div className={project.empty}>
      <span className={project.emptyIcon} aria-hidden="true">
        <FaFolderOpen />
      </span>
      <h1 className={project.emptyTitle}>No projects yet</h1>
      {canCreate ? (
        <>
          <p className={project.emptyText}>
            Create your first project to plan, track and ship your work.
          </p>
          <Link to="/create-project" className={project.btnPrimary}>
            <FaPlus />
            Create project
          </Link>
        </>
      ) : (
        <p className={project.emptyText}>
          You haven't been added to a project yet. Ask your team admin to invite you to one.
        </p>
      )}
    </div>
  );
};

export default NoProjects;
