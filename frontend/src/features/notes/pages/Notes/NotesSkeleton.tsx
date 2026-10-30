import React from "react";
import { Skeleton } from "@mui/material";

import { divider } from "shared/styles/sharedClasses";

// Shown in the dashboard content area while the Notes page's code is loading: search, "Create New Note" and note cards
const NotesSkeleton = () => {
  return (
    <div aria-busy="true">
      <div className="flex justify-between items-center mt-2.5 mr-5">
        <Skeleton variant="rounded" width={200} height={37} sx={{ borderRadius: "5px" }} />
        <Skeleton variant="rounded" width={170} height={37} />
      </div>
      <div className={divider} />
      <div className="grid grid-cols-[repeat(3,1fr)] gap-2.5 mt-2.5 mr-5">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="w-auto py-[5px] px-[15px] rounded-[5px] shadow-[1px_1px_10px_#0006]">
            <Skeleton variant="text" width="50%" sx={{ fontSize: 24 }} />
            <Skeleton variant="text" width="80%" sx={{ mt: "10px" }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesSkeleton;
