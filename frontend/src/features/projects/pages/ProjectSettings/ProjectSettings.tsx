import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useLocation } from "react-router-dom";
import { compose } from "redux";
import { connect, type ConnectedProps } from "react-redux";

import * as project from "features/projects/styles/projectClasses";

import ProjectSettingsSkeleton from "features/projects/pages/ProjectSettings/ProjectSettingsSkeleton";
import type { RootState } from "app/store";

const ProjectSettings = ({ currentProject }: Props) => {
  const [name, setName] = useState("");

  const { pathname, search } = useLocation();
  const projectId = new URLSearchParams(search).get("project");
  const title = pathname.startsWith("/project/team/") ? "Team Dashboard" : "Personal Dashboard";
  // The sidebar loads the project into the store; until then (or while it still holds another project) show the skeleton
  const loaded = currentProject.projectId === projectId;

  useEffect(() => {
    setName(currentProject.projectName ?? "");
  }, [currentProject.projectId, currentProject.projectName]);

  return (
    <>
      <Helmet>
        <title>{title} | Settings</title>
      </Helmet>
      {loaded ? (
        <div className={project.settings}>
          <section className={project.settingsCard} aria-labelledby="settings-general-title">
            <div className={project.settingsCardHeader}>
              <h2 id="settings-general-title" className={project.settingsCardTitle}>General</h2>
              <p className={project.settingsCardText}>The project's name and details.</p>
            </div>

            <div className={project.settingsForm}>
              <span className={project.settingsAvatar} aria-hidden="true">
                {(name || currentProject.projectName)?.substring(0, 1)}
              </span>
              <div className={project.settingsField}>
                <label htmlFor="settings-project-name" className={project.label}>Project name</label>
                <input
                  id="settings-project-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={project.input}
                  autoComplete="off"
                />
              </div>
              {/* Saving isn't wired up yet (the backend has PUT /project/updateProject) */}
              <button type="button" className={project.settingsButton}>Save</button>
            </div>

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
                <dt className={project.detailLabel}>Lead</dt>
                <dd className={project.detailValue}>{currentProject.leadBy}</dd>
              </div>
            </dl>
          </section>
        </div>
      ) : (
        <ProjectSettingsSkeleton />
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentProject: state.project.project,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(ProjectSettings);
