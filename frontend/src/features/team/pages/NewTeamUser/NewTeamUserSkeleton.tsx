import React from "react";
import { Skeleton } from "@mui/material";

// Shown in the dashboard content area while the Add team member page's code is loading:
// the CreateUser form and the team member table
const NewTeamUserSkeleton = () => {
  return (
    <div className="w-auto mr-5 px-2.5" aria-busy="true">
      <div className="flex gap-5 py-8 px-20 rounded-[10px] bg-[#efefef]">
        <Skeleton variant="rounded" width={350} height={300} className="shrink-0" />
        <div className="flex-1">
          <Skeleton variant="text" width="80%" sx={{ fontSize: 28, my: "10px" }} />
          <Skeleton variant="text" width="65%" />
          {/* Name and Email fields, then the button */}
          <Skeleton variant="rounded" height={56} sx={{ mt: "10px", mb: "20px" }} />
          <Skeleton variant="rounded" height={56} sx={{ mt: "10px", mb: "20px" }} />
          <Skeleton variant="rounded" width={120} height={36} sx={{ mt: "10px" }} />
        </div>
      </div>

      <div>
        <div className="flex items-center w-auto h-[30px] mt-2.5 p-2.5 border-t border-b border-[#9999] bg-[#c4c4c4]" />
        {[0, 1, 2].map((item) => (
          <div className="flex items-center p-2.5" key={item}>
            <div className="flex items-center w-[400px] my-2.5 max-[1400px]:w-[150px] gap-5">
              <Skeleton variant="circular" width={40} height={40} className="shrink-0" />
              <div className="flex-1">
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="70%" sx={{ fontSize: 14 }} />
              </div>
            </div>
            {/* Added On, Status, Role and Action columns */}
            {["w-[180px] max-[1400px]:w-[250px]", "w-[180px] max-[1400px]:w-[150px]", "w-[180px] max-[1400px]:w-[150px]", "w-[110px] max-[1400px]:w-[120px]"].map((column, index) => (
              <div key={index} className={column}>
                <Skeleton variant="text" width="60%" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewTeamUserSkeleton;
