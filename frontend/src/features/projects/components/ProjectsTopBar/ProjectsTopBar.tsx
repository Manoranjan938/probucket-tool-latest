import React from "react";
import { Link } from "react-router-dom";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import { FaSignOutAlt } from "react-icons/fa";

import * as project from "features/projects/styles/projectClasses";

import logo from "shared/assets/images/logo.png";
import type { RootState } from "app/store";

// Top bar of the Projects list and the Create project wizard (logo, signed-in user, Log out)
const ProjectsTopBar = ({ currentUser }: Props) => {
  return (
    <header className={project.topBar}>
      <div className={project.topBarInner}>
        <Link to="/projects" className={project.brand}>
          <img src={logo} alt="" className={project.brandLogo} />
          <span className={project.brandName}>ProBucket</span>
        </Link>

        <div className={project.user}>
          <span className={project.avatar} aria-hidden="true">
            {currentUser.fullName?.substring(0, 1)}
          </span>
          <span className={project.userName} title={currentUser.username}>
            {currentUser.fullName}
          </span>
          <Link to="/logout" className={project.logout}>
            <FaSignOutAlt />
            <span className="max-[480px]:sr-only">Log out</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(ProjectsTopBar);
