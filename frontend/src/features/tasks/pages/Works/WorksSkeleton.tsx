import React from "react";
import { Skeleton } from "@mui/material";

const columnBorders = ["border-t-[#888]", "border-t-[#4bbafa]", "border-t-[#63cf21]"];

// Shown in the dashboard content area while the Works page's code is loading: the three-column task board,
// with TeamWorkHeader's search box and member avatars above it on the team dashboard
const WorksSkeleton = ({ team = false }: { team?: boolean }) => {
  return (
    <div aria-busy="true">
      {team && (
        <div className="flex items-center mt-5 px-12">
          <Skeleton variant="rounded" width={200} height={37} sx={{ borderRadius: "5px" }} />
          <div className="flex ml-[50px] -space-x-2">
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} variant="circular" width={40} height={40} sx={{ border: "2px solid #fff" }} />
            ))}
          </div>
        </div>
      )}

      <div className="w-auto my-8 mx-12">
        <div className="grid grid-cols-[repeat(3,1fr)] gap-5 w-auto">
          {columnBorders.map((border) => (
            <div
              key={border}
              className={`flex items-center w-auto h-10 py-[5px] px-[15px] rounded-bl-[4px] rounded-br-[4px] shadow-[1px_1px_4px_#0006] border-t-[3px] ${border}`}
            >
              <Skeleton variant="text" width="45%" sx={{ fontSize: 16 }} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(3,1fr)] gap-5 w-auto">
          {[2, 1, 1].map((cards, column) => (
            <div key={column} className="mt-5">
              {Array.from({ length: cards }, (_, index) => (
                <Skeleton key={index} variant="rounded" height={70} sx={{ mb: "20px", borderRadius: "4px" }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorksSkeleton;
