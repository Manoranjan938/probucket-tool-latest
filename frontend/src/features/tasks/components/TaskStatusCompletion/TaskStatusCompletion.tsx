import { Box, CircularProgress, Typography } from "@mui/material";
import useGetTaskStatistics from "features/tasks/hooks/useGetTaskStatistics";
import React from "react";
import { useEffect } from "react";

import type { TaskDetails } from "features/tasks/types";

const TaskStatusCompletion = ({ task }: { task: Partial<TaskDetails> }) => {
  const [stats, getTaskStats] = useGetTaskStatistics();

  useEffect(() => {
    getTaskStats(task.taskSequence);
  }, [task.taskSequence]);

  return (
    <>
      <div className="w-auto mt-2.5 border border-[#999] rounded-[10px]">
        <div className="p-4 border-b border-[#999]">
          <h5 className="text-[16px]">Task Progress</h5>
        </div>
        <div className="flex justify-around p-4">
          <div>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant="determinate"
                value={stats.inprogress}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                >
                  {`${Math.round(Number(stats.inprogress))}%`}
                </Typography>
              </Box>
            </Box>
            <div>
              <span className="text-[16px] font-semibold text-[#777]">In Progress</span>
            </div>
          </div>
          <div>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant="determinate"
                color="success"
                value={stats.completed}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                >
                  {`${Math.round(Number(stats.completed))}%`}
                </Typography>
              </Box>
            </Box>
            <div>
              <span className="text-[16px] font-semibold text-[#777]">Completed</span>
            </div>
          </div>
          <div>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant="determinate"
                color="secondary"
                value={stats.pending}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                >
                  {`${Math.round(Number(stats.pending))}%`}
                </Typography>
              </Box>
            </Box>
            <div>
              <span className="text-[16px] font-semibold text-[#777]">Not Started</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskStatusCompletion;
