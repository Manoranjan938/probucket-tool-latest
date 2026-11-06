import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPlus } from "react-icons/fa";

import * as project from "features/projects/styles/projectClasses";

import ProjectsTopBar from "features/projects/components/ProjectsTopBar/ProjectsTopBar";
import NoProjects from "features/projects/components/NoProjects/NoProjects";
import { ProjectsContentSkeleton } from "features/projects/pages/Projects/ProjectsSkeleton";
import { projectTypes } from "features/projects/data";
import useGetAllProjects from "features/projects/hooks/useGetAllProjects";
import useGetProjectsByTeamMembers from "features/projects/hooks/useGetProjectsByTeamMembers";
import type { Project } from "features/projects/types";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { setAllProjects } from "features/projects/store/projectSlice";

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
  const myProjects = useAppSelector((state) => state.project.allProjects);
  const dispatch = useAppDispatch();
  const [, getAllProjectDetails] = useGetAllProjects();
  const [, getProjectsByTeam] = useGetProjectsByTeamMembers();
  const [loading, setLoading] = useState(true);

  // Team members are added to projects, everyone else creates their own
  const canCreate = currentUser.rolename !== "ROLE_TEAM-USER";

  useEffect(() => {
    const loadProjects = async () => {
      try {
        if (
          currentUser.rolename === "ROLE_PERSONAL" ||
          currentUser.rolename === "ROLE_TEAM-ADMIN" ||
          currentUser.rolename === "ROLE_USER"
        ) {
          const res = await getAllProjectDetails(currentUser.id);
          dispatch(setAllProjects(res.data.data));
        } else if (currentUser.rolename === "ROLE_TEAM-USER") {
          const res = await getProjectsByTeam(currentUser.id);
          dispatch(setAllProjects(res.data.data));
        }
      } catch (err) {
        console.log(err);
        dispatch(setAllProjects([]));
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className={project.page}>
      <ProjectsTopBar />

      <main className={project.container}>
        {loading ? (
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
      </main>
    </div>
  );
};

export default Projects;
