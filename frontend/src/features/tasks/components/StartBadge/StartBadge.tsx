import React from "react";
import { FiPlayCircle } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import { formatDueDate } from "features/tasks/data";

// When work on a task is planned to start
const StartBadge = ({ startDate }: { startDate: string }) => (
  <span className={task.startBadge}>
    <FiPlayCircle aria-hidden="true" />
    Starts {formatDueDate(startDate)}
  </span>
);

export default StartBadge;
