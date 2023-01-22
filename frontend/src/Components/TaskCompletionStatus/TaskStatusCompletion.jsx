import { Box, CircularProgress, Typography } from "@mui/material";
import useGetTaskStatistics from "hooks/useGetTaskStatistics";
import React from "react";
import { useEffect } from "react";

import "./TaskStatus.css";

const TaskStatusCompletion = ({ task }) => {
  const [stats, getTaskStats] = useGetTaskStatistics();

  useEffect(() => {
    getTaskStats(task.taskSequence);
  }, [task.taskSequence]);

  return (
    <>
      <div className="task__status__container">
        <div className="task__status__header">
          <h5>Task Progress</h5>
        </div>
        <div className="task__status__body">
          <div className="status__in__progress">
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
                  {`${Math.round(stats.inprogress)}%`}
                </Typography>
              </Box>
            </Box>
            <div className="status__label">
              <span>In Progress</span>
            </div>
          </div>
          <div className="status__done">
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
                  {`${Math.round(stats.completed)}%`}
                </Typography>
              </Box>
            </Box>
            <div className="status__label">
              <span>Completed</span>
            </div>
          </div>
          <div className="status__not__started">
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
                  {`${Math.round(stats.pending)}%`}
                </Typography>
              </Box>
            </Box>
            <div className="status__label">
              <span>Not Started</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskStatusCompletion;
