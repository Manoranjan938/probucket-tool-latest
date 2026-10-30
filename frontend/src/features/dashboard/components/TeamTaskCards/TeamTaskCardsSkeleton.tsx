import React from "react";
import { Skeleton } from "@mui/material";

// Loading state of TeamTaskCards: the four task count cards
const TeamTaskCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-[repeat(4,1fr)] gap-3.5 mt-5 mr-5">
      {[0, 1, 2, 3].map((item) => (
        <Skeleton key={item} variant="rounded" height={75} sx={{ borderRadius: "10px" }} />
      ))}
    </div>
  );
};

export default TeamTaskCardsSkeleton;
