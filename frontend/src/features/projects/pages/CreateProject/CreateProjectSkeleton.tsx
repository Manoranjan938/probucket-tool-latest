import React from "react";
import { Skeleton } from "@mui/material";

// Shown while the Create project page's code is loading (its first step, ChooseTemplate, with the three template cards)
const CreateProjectSkeleton = () => {
  return (
    <div className="h-screen bg-[#efefef] max-[768px]:py-10 max-[768px]:px-[1.3rem]" aria-busy="true">
      <div className="w-[800px] mx-auto py-[2%] max-[768px]:w-auto max-[768px]:p-0">
        <Skeleton variant="text" width={220} sx={{ fontSize: 16, mb: "10px" }} />
        {[0, 1, 2].map((item) => (
          <div key={item} className="flex w-full h-[160px] mb-5 rounded-xl shadow-[1px_1px_5px_1px_#0003]">
            <div className="w-[250px] -mr-2.5 bg-[#efeeef]">
              <Skeleton variant="rectangular" width="100%" height={150} className="rounded-tl-xl" />
            </div>
            <div className="flex justify-between items-center w-full ml-2.5 bg-white rounded-tr-xl rounded-br-xl">
              <div className="w-[80%] ml-5 max-[768px]:w-[70%]">
                <Skeleton variant="text" width="40%" sx={{ fontSize: 19, mb: "16px" }} />
                <Skeleton variant="text" width="95%" />
                <Skeleton variant="text" width="70%" />
              </div>
              <Skeleton variant="circular" width={16} height={16} sx={{ mr: "26px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateProjectSkeleton;
