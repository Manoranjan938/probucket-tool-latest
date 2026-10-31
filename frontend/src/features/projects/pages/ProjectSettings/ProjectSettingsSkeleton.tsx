import React from "react";
import { Skeleton } from "@mui/material";

import * as project from "features/projects/styles/projectClasses";

// Shown in the dashboard content area while the Project settings page's code or the project is loading
const ProjectSettingsSkeleton = () => {
  return (
    <div className={project.settings} aria-busy="true">
      <div className={project.settingsCard}>
        <div className={project.settingsCardHeader}>
          <Skeleton variant="text" width={90} sx={{ fontSize: 16 }} />
          <Skeleton variant="text" width={220} sx={{ fontSize: 14, maxWidth: "100%" }} />
        </div>
        <div className={project.settingsForm}>
          <Skeleton variant="rounded" width={56} height={56} sx={{ borderRadius: "12px" }} className="shrink-0" />
          <div className={project.settingsField}>
            <Skeleton variant="text" width={100} sx={{ fontSize: 14 }} />
            <Skeleton variant="rounded" height={46} sx={{ borderRadius: "10px" }} />
          </div>
          <Skeleton variant="rounded" width={80} height={46} sx={{ borderRadius: "10px" }} />
        </div>
        <div className={project.detailList}>
          {[0, 1, 2].map((item) => (
            <div key={item} className={project.detailRow}>
              <Skeleton variant="text" width={50} sx={{ fontSize: 14 }} />
              <Skeleton variant="text" width={140} sx={{ fontSize: 14 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsSkeleton;
