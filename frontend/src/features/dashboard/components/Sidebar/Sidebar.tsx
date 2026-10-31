import React, { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import { FiX } from "react-icons/fi";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import logo from "shared/assets/images/logo.png";
import ProjectSwitcher from "features/dashboard/components/ProjectSwitcher/ProjectSwitcher";
import AccountMenu from "features/dashboard/components/AccountMenu/AccountMenu";
import { dashboardLink, mainNav, manageNav, visibleNav, type DashboardType, type NavItem } from "features/dashboard/data";
import { getProjectDetails } from "features/projects/store/projectsAction";
import useGetProjectDetails from "features/projects/hooks/useGetProjectDetails";
import type { AppDispatch, RootState } from "app/store";
import type { Project } from "features/projects/types";

type OwnProps = {
  type: DashboardType;
  id: string | null;
  name: string | null;
  /** Drawer state below 1024px; the sidebar is always shown above that */
  open: boolean;
  onClose: () => void;
};

// Sidebar of the personal and team dashboards: project switcher, page links and the account menu
const Sidebar = ({ type, id, name, open, onClose, getSingleProject, currentUser }: OwnProps & Props) => {
  const [project, getProjectDetails] = useGetProjectDetails();

  // Again when the project switcher opens another project of the same type
  useEffect(() => {
    getProjectDetails(id).catch(() => {});
  }, [id]);

  useEffect(() => {
    getSingleProject(project);
  }, [project]);

  const renderLinks = (items: NavItem[]) => (
    <ul className={dashboard.navList}>
      {visibleNav(items, type, currentUser.rolename).map((item) => (
        <li key={item.path}>
          <NavLink
            to={dashboardLink(type, item.path, id, name)}
            className={({ isActive }) => (isActive ? dashboard.navLinkActive : dashboard.navLink)}
          >
            <item.icon className={dashboard.navIcon} aria-hidden="true" />
            {item.title}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <aside className={open ? dashboard.sidebarOpen : dashboard.sidebar} aria-label="Project navigation">
      <div className={dashboard.sidebarBrandRow}>
        <Link to="/projects" className={dashboard.brand}>
          <img src={logo} alt="" className={dashboard.brandLogo} />
          <span className={dashboard.brandName}>ProBucket</span>
        </Link>
        <button type="button" className={dashboard.menuButton} onClick={onClose} aria-label="Close menu">
          <FiX />
        </button>
      </div>

      <div className={dashboard.sidebarSection}>
        <ProjectSwitcher project={project} />
      </div>

      <nav className={dashboard.nav}>
        {renderLinks(mainNav)}
        <p className={dashboard.navLabel}>Manage</p>
        {renderLinks(manageNav)}
      </nav>

      <div className={dashboard.sidebarFooter}>
        <AccountMenu />
      </div>
    </aside>
  );
};

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getSingleProject: (data: Partial<Project>) => dispatch(getProjectDetails(data)),
  };
}

const mapStateToProps = (state: RootState) => ({
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(Sidebar);
