import React from "react";
import { Skeleton } from "@mui/material";

// Shown in the dashboard content area while the Todos page's code is loading: filter tabs, button and todo cards
const TodosSkeleton = () => {
  return (
    <div aria-busy="true">
      <div className="w-auto px-5">
        <div className="flex justify-between items-center border-b-2 border-[#777]">
          <div className="flex items-center gap-5">
            {[60, 120, 100].map((width) => (
              <Skeleton key={width} variant="rounded" width={width} height={34} sx={{ borderRadius: "5px" }} />
            ))}
          </div>
          <Skeleton variant="rounded" width={150} height={40} sx={{ my: "10px", borderRadius: "5px" }} />
        </div>
      </div>
      <div className="flex flex-wrap gap-5 w-auto my-2.5 px-5">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
          <Skeleton
            key={item}
            variant="rounded"
            height={66}
            className="w-[250px]! max-[1400px]:w-[210px]!"
            sx={{ borderRadius: "5px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default TodosSkeleton;
