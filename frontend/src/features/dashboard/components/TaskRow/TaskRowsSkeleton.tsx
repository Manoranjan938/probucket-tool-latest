import React from "react";
import { Skeleton } from "@mui/material";

// Loading state of a list of TaskRows
const TaskRowsSkeleton = () => {
  return (
    <div aria-busy="true">
      {[0, 1, 2, 3].map((item) => (
        <Skeleton key={item} variant="text" sx={{ fontSize: 15, my: "10px" }} />
      ))}
    </div>
  );
};

export default TaskRowsSkeleton;
