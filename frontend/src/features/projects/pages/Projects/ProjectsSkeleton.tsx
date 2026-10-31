import React from "react";
import { Skeleton } from "@mui/material";

import * as project from "features/projects/styles/projectClasses";

import ProjectsTopBarSkeleton from "features/projects/components/ProjectsTopBar/ProjectsTopBarSkeleton";

// Heading and project cards – also shown by the Projects page while the projects are being fetched
export const ProjectsContentSkeleton = () => {
  return (
    <div aria-busy="true">
      <div className={project.header}>
        <div>
          <Skeleton variant="text" width={220} sx={{ fontSize: 28, mb: "6px" }} />
          <Skeleton variant="text" width={280} sx={{ fontSize: 16, maxWidth: "100%" }} />
        </div>
        <Skeleton variant="rounded" width={150} height={44} sx={{ borderRadius: "10px" }} />
      </div>

      <div className={project.grid}>
        {[0, 1, 2].map((item) => (
          <div key={item} className={project.card}>
            <div className="flex items-center gap-4">
              <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: "12px" }} className="shrink-0" />
              <div className="flex-1">
                <Skeleton variant="text" width="70%" sx={{ fontSize: 17 }} />
                <Skeleton variant="rounded" width={80} height={20} sx={{ borderRadius: "999px" }} />
              </div>
            </div>
            <div className={project.cardFooter}>
              <Skeleton variant="text" width="50%" sx={{ fontSize: 14 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Shown while the Projects page's code is loading
const ProjectsSkeleton = () => {
  return (
    <div className={project.page}>
      <ProjectsTopBarSkeleton />
      <main className={project.container}>
        <ProjectsContentSkeleton />
      </main>
    </div>
  );
};

export default ProjectsSkeleton;
