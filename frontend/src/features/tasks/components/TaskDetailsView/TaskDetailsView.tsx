import React, { useEffect, useState } from "react";
import { Dialog, Drawer } from "@mui/material";
import { useSnackbar } from "notistack";

import * as task from "features/tasks/styles/taskClasses";

import TaskDetails, { type DetailsView } from "features/tasks/components/TaskDetails/TaskDetails";
import useSelectedTask from "features/tasks/hooks/useSelectedTask";
import { toastOptions } from "features/tasks/data";

// Side panel or modal – the last choice is remembered in this browser
const VIEW_KEY = "probucket.taskDetailsView";

const readView = (): DetailsView => {
  try {
    return localStorage.getItem(VIEW_KEY) === "modal" ? "modal" : "panel";
  } catch {
    return "panel";
  }
};

type Props = {
  /** Sequence of the task to show; null when closed */
  sequence: string | null;
  onClose: () => void;
  /** Shows another task instead, e.g. the parent of a subtask */
  onOpenTask: (sequence: string) => void;
};

// Shows the open task in a side panel, or a centered modal when expanded
const TaskDetailsView = ({ sequence, onClose, onOpenTask }: Props) => {
  const [view, setView] = useState<DetailsView>(readView);
  const { isError } = useSelectedTask();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Couldn't load the task. Please try again.", { ...toastOptions, variant: "error" });
    }
  }, [isError, enqueueSnackbar]);

  const handleToggleView = () => {
    const next = view === "panel" ? "modal" : "panel";
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // Not remembered, e.g. in a private window
    }
  };

  const content = sequence ? (
    <TaskDetails
      sequence={sequence}
      view={view}
      onToggleView={handleToggleView}
      onClose={onClose}
      onOpenTask={onOpenTask}
    />
  ) : null;

  return view === "panel" ? (
    <Drawer
      anchor="right"
      open={Boolean(sequence)}
      onClose={onClose}
      PaperProps={{ className: task.panelPaper, "aria-label": "Task details" } as object}
      BackdropProps={{ sx: { bgcolor: "rgba(31, 29, 58, 0.25)" } }}
    >
      {content}
    </Drawer>
  ) : (
    <Dialog
      open={Boolean(sequence)}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ className: task.modalPaper, "aria-label": "Task details" } as object}
    >
      {content}
    </Dialog>
  );
};

export default TaskDetailsView;
