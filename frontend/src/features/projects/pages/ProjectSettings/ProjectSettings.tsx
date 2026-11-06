import React, { useState } from "react";
import Helmet from "react-helmet";
import { Link, useLocation } from "react-router-dom";

import * as project from "features/projects/styles/projectClasses";

import ProjectGeneralCard from "features/projects/components/ProjectGeneralCard/ProjectGeneralCard";
import DeleteProjectDialog from "features/projects/components/DeleteProjectDialog/DeleteProjectDialog";
import ProjectSettingsSkeleton from "features/projects/pages/ProjectSettings/ProjectSettingsSkeleton";
import { dashboardLink } from "features/dashboard/data";
import { PROJECT_RETENTION_DAYS } from "features/projects/data";
import ComingSoonBadge from "shared/components/ComingSoonBadge/ComingSoonBadge";
import useCurrentProject from "features/projects/hooks/useCurrentProject";
import { useAppSelector } from "app/hooks";

// Everyone on the project sees its details; only the lead gets the rest
// TODO(project-backend): every "Coming soon" here is listed in features/projects/BACKEND_TODO.md
const ProjectSettings = () => {
  // Undefined until this project's details are loaded, which shows the skeleton
  const { currentData: currentProject } = useCurrentProject();
  const currentUser = useAppSelector((state) => state.security.user);
  const { pathname, search } = useLocation();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const query = new URLSearchParams(search);
  const projectId = query.get("project");
  const isTeam = pathname.startsWith("/project/team/");
  const title = isTeam ? "Team Dashboard" : "Personal Dashboard";
  const isLead = Boolean(currentProject?.leadEmail) && currentProject?.leadEmail === currentUser.username;
  // Same rule as the Team members link in the sidebar
  const canManageTeam = isTeam && currentUser.rolename !== "ROLE_TEAM-USER";

  return (
    <>
      <Helmet>
        <title>{title} | Settings</title>
      </Helmet>
      {currentProject ? (
        <div className={project.settings}>
          <ProjectGeneralCard currentProject={currentProject} isLead={isLead} />

          {isLead ? (
            <>
              <section className={project.settingsCard} aria-labelledby="settings-description-title">
                <div className={project.settingsCardHeader}>
                  <div>
                    <h2 id="settings-description-title" className={project.settingsCardTitle}>Description</h2>
                    <p className={project.settingsCardText}>What this project is for.</p>
                  </div>
                  <ComingSoonBadge />
                </div>
                <div className={project.settingsCardBody}>
                  <label htmlFor="settings-project-description" className="sr-only">Project description</label>
                  <textarea id="settings-project-description" className={project.textarea} disabled />
                </div>
              </section>

              <section className={project.settingsCard} aria-labelledby="settings-icon-title">
                <div className={project.settingsCardHeader}>
                  <div>
                    <h2 id="settings-icon-title" className={project.settingsCardTitle}>Project icon</h2>
                    <p className={project.settingsCardText}>The project's first letter is used for now.</p>
                  </div>
                  <ComingSoonBadge />
                </div>
                <div className={project.settingsCardBody}>
                  <div className={project.settingsIconRow}>
                    <span className={project.settingsAvatar} aria-hidden="true">
                      {currentProject.projectName?.substring(0, 1)}
                    </span>
                    <button type="button" className={project.settingsButtonGhost} disabled>Upload icon</button>
                  </div>
                </div>
              </section>
            </>
          ) : null}

          {canManageTeam ? (
            <section className={project.settingsCard} aria-labelledby="settings-people-title">
              <div className={project.settingsCardHeader}>
                <div>
                  <h2 id="settings-people-title" className={project.settingsCardTitle}>People</h2>
                  <p className={project.settingsCardText}>Who works on this project.</p>
                </div>
              </div>
              <ul className={project.settingsRows}>
                <li className={project.settingsRow}>
                  <div className={project.settingsRowText}>
                    <p className={project.settingsRowTitle}>Team members</p>
                    <p className={project.settingsRowNote}>Add people and edit their roles.</p>
                  </div>
                  <Link
                    to={dashboardLink("team", "new-user", projectId, query.get("name"))}
                    className={project.settingsButtonGhost}
                  >
                    Manage members
                  </Link>
                </li>
                {isLead ? (
                  <>
                    <li className={project.settingsRow}>
                      <div className={project.settingsRowText}>
                        <p className={project.settingsRowTitle}>Change project lead</p>
                        <p className={project.settingsRowNote}>Hand this project over to someone else.</p>
                      </div>
                      <div className={project.settingsRowActions}><ComingSoonBadge /></div>
                    </li>
                    <li className={project.settingsRow}>
                      <div className={project.settingsRowText}>
                        <p className={project.settingsRowTitle}>Default assignee</p>
                        <p className={project.settingsRowNote}>Who new tasks are assigned to.</p>
                      </div>
                      <div className={project.settingsRowActions}><ComingSoonBadge /></div>
                    </li>
                  </>
                ) : null}
              </ul>
            </section>
          ) : null}

          {isLead ? (
            <section className={project.settingsCardDanger} aria-labelledby="settings-danger-title">
              <div className={project.settingsCardHeader}>
                <div>
                  <h2 id="settings-danger-title" className={project.settingsCardTitle}>Archive or delete</h2>
                  <p className={project.settingsCardText}>These affect everyone on the project.</p>
                </div>
              </div>
              <ul className={project.settingsRows}>
                <li className={project.settingsRow}>
                  <div className={project.settingsRowText}>
                    <p className={project.settingsRowTitle}>Archive project</p>
                    <p className={project.settingsRowNote}>Put the project away when the work is finished.</p>
                  </div>
                  <div className={project.settingsRowActions}>
                    <ComingSoonBadge />
                    <button type="button" className={project.settingsButtonGhost} disabled>Archive</button>
                  </div>
                </li>
                <li className={project.settingsRow}>
                  <div className={project.settingsRowText}>
                    <p className={project.settingsRowTitle}>Delete project</p>
                    <p className={project.settingsRowNote}>
                      Hide the project and its tasks from everyone. You can restore it for {PROJECT_RETENTION_DAYS} days.
                    </p>
                  </div>
                  <div className={project.settingsRowActions}>
                    <button type="button" className={project.settingsButtonDanger} onClick={() => setDeleteOpen(true)}>
                      Delete
                    </button>
                  </div>
                </li>
              </ul>
              <DeleteProjectDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} currentProject={currentProject} />
            </section>
          ) : null}
        </div>
      ) : (
        <ProjectSettingsSkeleton />
      )}
    </>
  );
};

export default ProjectSettings;
