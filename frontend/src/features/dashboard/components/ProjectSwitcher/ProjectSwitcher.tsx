import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import { Divider, Menu, MenuItem } from "@mui/material";
import { FiCheck, FiChevronDown, FiFolder } from "react-icons/fi";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import { getAllProjects } from "features/projects/store/projectsAction";
import useGetAllProjects from "features/projects/hooks/useGetAllProjects";
import useGetProjectsByTeamMembers from "features/projects/hooks/useGetProjectsByTeamMembers";
import { dashboardLink, type DashboardType } from "features/dashboard/data";
import type { AppDispatch, RootState } from "app/store";
import type { Project } from "features/projects/types";

type OwnProps = { project: Partial<Project> };

// The current project at the top of the sidebar; opens a menu to switch to another project
const ProjectSwitcher = ({ project, currentUser, myProjects, getProjects }: OwnProps & Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [, getAllProjectDetails] = useGetAllProjects();
  const [, getProjectsByTeam] = useGetProjectsByTeamMembers();
  const open = Boolean(anchorEl);

  // Same role check as the Projects page
  const loadProjects = async () => {
    setLoading(true);
    try {
      if (currentUser.rolename === "ROLE_TEAM-USER") {
        const res = await getProjectsByTeam(currentUser.id);
        getProjects(res.data);
      } else {
        const res = await getAllProjectDetails(currentUser.id);
        getProjects(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    loadProjects();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <button
        type="button"
        className={dashboard.menuTrigger}
        onClick={handleOpen}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? "project-menu" : undefined}
      >
        <span className={dashboard.projectAvatar} aria-hidden="true">
          {project.projectName?.substring(0, 1)}
        </span>
        <span className={dashboard.triggerText}>
          <span className={`block ${dashboard.triggerTitle}`}>{project.projectName}</span>
          <span className={`block ${dashboard.triggerSubtitle}`}>
            {project.projectType ? `${project.projectType} project` : null}
          </span>
        </span>
        <FiChevronDown className={dashboard.triggerChevron} aria-hidden="true" />
      </button>

      <Menu
        id="project-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ className: dashboard.menuPaper, sx: { width: anchorEl?.offsetWidth } }}
      >
        <li className={dashboard.menuHeading} role="presentation">Switch project</li>
        {myProjects.length === 0 && loading ? (
          <li className={dashboard.menuItemMuted} role="presentation">Loading projects…</li>
        ) : null}
        {myProjects.map((item) => {
          const current = item.projectId === project.projectId;
          return (
            <MenuItem
              key={item.projectId}
              component={Link}
              to={dashboardLink(item.projectType as DashboardType, "home", item.projectId, item.projectIdentifier)}
              onClick={handleClose}
              selected={current}
              className={dashboard.menuItem}
            >
              <span className={`${dashboard.projectAvatar} w-7! h-7! rounded-lg! text-[13px]!`} aria-hidden="true">
                {item.projectName.substring(0, 1)}
              </span>
              <span className={dashboard.menuItemProject}>{item.projectName}</span>
              {current ? <FiCheck className={dashboard.menuItemCheck} aria-label="Current project" /> : null}
            </MenuItem>
          );
        })}
        <Divider />
        <MenuItem component={Link} to="/projects" onClick={handleClose} className={dashboard.menuItem}>
          <FiFolder className={dashboard.menuItemIcon} aria-hidden="true" />
          All projects
        </MenuItem>
      </Menu>
    </>
  );
};

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getProjects: (data: Project[]) => dispatch(getAllProjects(data)),
  };
}

const mapStateToProps = (state: RootState) => ({
  currentUser: state.security.user,
  myProjects: state.project.allProjects,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(ProjectSwitcher);
