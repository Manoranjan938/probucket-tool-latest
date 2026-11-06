import React from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

import * as project from "features/projects/styles/projectClasses";

import logo from "shared/assets/images/logo.png";
import { useAppSelector } from "app/hooks";

// Top bar of the Projects list, the Create project wizard and the Profile page (logo, link to the profile, Log out)
const ProjectsTopBar = () => {
  const currentUser = useAppSelector((state) => state.security.user);

  return (
    <header className={project.topBar}>
      <div className={project.topBarInner}>
        <Link to="/projects" className={project.brand}>
          <img src={logo} alt="" className={project.brandLogo} />
          <span className={project.brandName}>ProBucket</span>
        </Link>

        <div className={project.user}>
          <Link to="/profile" className={project.userLink} aria-label={`Your profile: ${currentUser.fullName ?? ""}`}>
            <span className={project.avatar} aria-hidden="true">
              {currentUser.fullName?.substring(0, 1)}
            </span>
            <span className={project.userName} title={currentUser.username}>
              {currentUser.fullName}
            </span>
          </Link>
          <Link to="/logout" className={project.logout}>
            <FaSignOutAlt />
            <span className="max-[480px]:sr-only">Log out</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default ProjectsTopBar;
