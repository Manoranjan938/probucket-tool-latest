import React from "react";
import { Skeleton } from "@mui/material";

import * as project from "features/projects/styles/projectClasses";

import ProjectsTopBarSkeleton from "features/projects/components/ProjectsTopBar/ProjectsTopBarSkeleton";

// Shown while the Create project page's code is loading (the wizard on its first step, Choose a template)
const CreateProjectSkeleton = () => {
  return (
    <div className={project.page} aria-busy="true">
      <ProjectsTopBarSkeleton />

      <main className={project.wizardContainer}>
        <div className={project.wizardHeader}>
          <div className="flex-1 min-w-0">
            <Skeleton variant="text" width={240} sx={{ fontSize: 28, mb: "6px", maxWidth: "100%" }} />
            <Skeleton variant="text" width={300} sx={{ fontSize: 16, maxWidth: "100%" }} />
          </div>
          <Skeleton variant="rounded" width={92} height={44} sx={{ borderRadius: "10px" }} className="shrink-0" />
        </div>

        <div className={project.stepper}>
          {[0, 1, 2].map((item) => (
            <div key={item} className={project.stepItem}>
              <Skeleton variant="circular" width={32} height={32} className="shrink-0" />
              {/* Wrapped, as MUI's own display style would win over a hidden class on the Skeleton */}
              <span className="max-[560px]:hidden">
                <Skeleton variant="text" width={80} sx={{ fontSize: 15 }} />
              </span>
              {item < 2 ? <span className="flex-1 h-0.5 min-w-4 rounded-full bg-brand-border" /> : null}
            </div>
          ))}
        </div>

        <div className={project.wizardCard}>
          <Skeleton variant="text" width={200} sx={{ fontSize: 20, mb: "4px" }} />
          <Skeleton variant="text" width={280} sx={{ fontSize: 15, mb: "24px", maxWidth: "100%" }} />

          <div className={project.optionGrid}>
            {[0, 1, 2].map((item) => (
              <div key={item} className="p-5 border border-brand-border rounded-xl">
                <Skeleton variant="rounded" width={44} height={44} sx={{ mb: "16px", borderRadius: "10px" }} />
                <Skeleton variant="text" width="75%" sx={{ fontSize: 16, mb: "6px" }} />
                <Skeleton variant="text" width="100%" sx={{ fontSize: 14 }} />
                <Skeleton variant="text" width="60%" sx={{ fontSize: 14 }} />
              </div>
            ))}
          </div>

          <div className={project.wizardActions}>
            <span />
            <Skeleton variant="rounded" width={130} height={44} sx={{ borderRadius: "10px" }} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateProjectSkeleton;
