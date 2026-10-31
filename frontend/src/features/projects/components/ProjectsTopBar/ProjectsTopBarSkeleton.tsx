import React from "react";
import { Skeleton } from "@mui/material";

import * as project from "features/projects/styles/projectClasses";

import logo from "shared/assets/images/logo.png";

// ProjectsTopBar while the page's code is loading – the logo is real, the user is a placeholder
const ProjectsTopBarSkeleton = () => {
  return (
    <header className={project.topBar}>
      <div className={project.topBarInner}>
        <span className={project.brand}>
          <img src={logo} alt="" className={project.brandLogo} />
          <span className={project.brandName}>ProBucket</span>
        </span>

        <div className={project.user}>
          <Skeleton variant="circular" width={36} height={36} />
          <span className="max-[640px]:hidden">
            <Skeleton variant="text" width={110} sx={{ fontSize: 15 }} />
          </span>
          {/* Log out is icon-only on small screens */}
          <span className="max-[480px]:hidden">
            <Skeleton variant="rounded" width={96} height={36} sx={{ borderRadius: "8px" }} />
          </span>
          <span className="hidden max-[480px]:block">
            <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: "8px" }} />
          </span>
        </div>
      </div>
    </header>
  );
};

export default ProjectsTopBarSkeleton;
