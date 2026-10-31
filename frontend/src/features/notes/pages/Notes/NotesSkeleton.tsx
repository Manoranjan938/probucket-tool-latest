import React from "react";
import { Skeleton } from "@mui/material";

import * as note from "features/notes/styles/noteClasses";

// Placeholder note cards – also shown by the Notes page while the notes load
export const NoteCardsSkeleton = () => {
  return (
    <div className={note.grid} aria-busy="true">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div key={item} className={`${note.card} flex-col min-h-[150px] p-5`}>
          <Skeleton variant="text" width="55%" sx={{ fontSize: 16, mb: "8px" }} />
          <Skeleton variant="text" width="95%" sx={{ fontSize: 14 }} />
          <Skeleton variant="text" width="85%" sx={{ fontSize: 14 }} />
          <Skeleton variant="text" width="60%" sx={{ fontSize: 14 }} />
        </div>
      ))}
    </div>
  );
};

// Shown in the dashboard content area while the Notes page's code is loading: toolbar and note cards
const NotesSkeleton = () => {
  return (
    <div className={note.page} aria-busy="true">
      <div className={note.toolbar}>
        <Skeleton variant="rounded" width={280} height={40} sx={{ borderRadius: "10px", maxWidth: "100%" }} />
        <Skeleton variant="rounded" width={120} height={40} sx={{ borderRadius: "10px" }} className="ml-auto" />
      </div>
      <NoteCardsSkeleton />
    </div>
  );
};

export default NotesSkeleton;
