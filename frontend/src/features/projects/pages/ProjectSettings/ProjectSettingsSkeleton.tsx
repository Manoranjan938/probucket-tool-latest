import React from "react";
import { Skeleton } from "@mui/material";

// Shown in the dashboard content area while the Project settings page's code is loading
const ProjectSettingsSkeleton = () => {
  return (
    <div className="w-auto px-5" aria-busy="true">
      <Skeleton variant="text" width={180} sx={{ fontSize: 24 }} />
      <div className="flex items-center gap-2.5 w-[500px] mt-5 mx-auto mb-0 p-2.5 border border-[#888] rounded-[6px]">
        <Skeleton variant="rectangular" width={170} height={170} className="shrink-0" />
        <div className="flex-1">
          {/* Name, Project Lead and Default Assignee fields, then Save */}
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} variant="rounded" height={56} sx={{ mb: "10px" }} />
          ))}
          <Skeleton variant="rounded" width={64} height={36} />
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsSkeleton;
