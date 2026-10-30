import React from "react";
import { Skeleton } from "@mui/material";

// Shown while the Projects page's code is loading (the "has projects" layout: image, title row, project cards)
const ProjectsSkeleton = () => {
  return (
    <div className="px-28" aria-busy="true">
      <div className="w-full h-[400px]">
        {/* Personal-Project.png (1042×757) drawn with object-contain in the 400px tall box */}
        <Skeleton variant="rounded" width={551} height="100%" sx={{ maxWidth: "100%", mx: "auto" }} />
        <div className="flex justify-between items-center mt-2.5">
          <Skeleton variant="text" width={280} sx={{ fontSize: 24 }} />
          <Skeleton variant="rounded" width={190} height={40} sx={{ my: "10px", borderRadius: "5px" }} />
        </div>
      </div>
      <div className="flex mt-[75px] ml-0">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="block w-[300px] h-[120px] mr-5 py-6 px-4 border border-[#e5e5e5] rounded-xl shadow-[1px_1px_10px_#0000004d]"
          >
            <div className="flex gap-5">
              <Skeleton variant="rectangular" width={80} height={80} className="shrink-0" />
              <div className="flex-1 my-auto">
                <Skeleton variant="text" width="80%" sx={{ fontSize: 18 }} />
                <Skeleton variant="text" width="45%" sx={{ fontSize: 13 }} />
              </div>
            </div>
            <Skeleton variant="text" width="75%" sx={{ fontSize: 15, mt: "10%" }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSkeleton;
