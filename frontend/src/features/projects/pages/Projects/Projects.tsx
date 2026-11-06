import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPlus } from "react-icons/fa";

import * as project from "features/projects/styles/projectClasses";

import ProjectsTopBar from "features/projects/components/ProjectsTopBar/ProjectsTopBar";
import NoProjects from "features/projects/components/NoProjects/NoProjects";
import RecentlyDeleted from "features/projects/components/RecentlyDeleted/RecentlyDeleted";
import { ProjectsContentSkeleton } from "features/projects/pages/Projects/ProjectsSkeleton";
import { projectTypes } from "features/projects/data";
import { useGetMyProjectsQuery } from "features/projects/api/projectsApi";
import type { Project } from "features/projects/types";
import { useAppSelector } from "app/hooks";

const ProjectCard = ({ item }: { item: Project }) => {
  const TypeIcon = projectTypes.find((type) => type.value === item.projectType)?.icon;

  return (
    <Link
      to={`/project/${item.projectType}/home?project=${item.projectId}&name=${item.projectIdentifier}`}
      className={project.card}
    >
      <div className="flex items-center gap-4 min-w-0">
        <span className={project.cardAvatar} aria-hidden="true">
          {item.projectName.substring(0, 1)}
        </span>
        <div className="min-w-0">
          <h2 className={project.cardName}>{item.projectName}</h2>
          <span className={project.badge}>
            {TypeIcon ? <TypeIcon aria-hidden="true" /> : null}
            {item.projectType}
          </span>
        </div>
      </div>
      <div className={project.cardFooter}>
        <span className={project.cardLead}>
          Lead <span className={project.cardLeadName}>{item.leadBy}</span>
        </span>
        <FaArrowRight className={project.cardArrow} aria-hidden="true" />
      </div>
    </Link>
  );
};

const Projects = () => {
  const currentUser = useAppSelector((state) => state.security.user);
  // Shown as empty if they couldn't be loaded
  const { data: myProjects = [], isLoading } = useGetMyProjectsQuery({ id: currentUser.id, rolename: currentUser.rolename });

  // Team members are added to projects, everyone else creates their own
  const canCreate = currentUser.rolename !== "ROLE_TEAM-USER";

  return (
    <div className={project.page}>
      <ProjectsTopBar />

      <main className={project.container}>
        {isLoading ? (
          <ProjectsContentSkeleton />
        ) : myProjects.length > 0 ? (
          <>
            <div className={project.header}>
              <div>
                <h1 className={project.title}>Your projects</h1>
                <p className={project.subtitle}>Pick a project to open its dashboard.</p>
              </div>
              {canCreate ? (
                <Link to="/create-project" className={project.btnPrimary}>
                  <FaPlus />
                  New project
                </Link>
              ) : null}
            </div>

            <ul className={project.grid}>
              {myProjects.map((item) => (
                <li key={item.projectId}>
                  <ProjectCard item={item} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <NoProjects canCreate={canCreate} />
        )}

        {/* Only leads delete projects, and team members can't lead one */}
        {canCreate && currentUser.id && !isLoading ? <RecentlyDeleted userId={currentUser.id} /> : null}
      </main>
    </div>
  );
};

export default Projects;
