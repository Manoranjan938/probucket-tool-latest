import React from "react";
import { Skeleton } from "@mui/material";

// Shown while the Bugs page's code is loading (the page is a stub that only renders the word "Bugs")
const BugsSkeleton = () => {
  return (
    <div aria-busy="true">
      <Skeleton variant="text" width={40} />
    </div>
  );
};

export default BugsSkeleton;
