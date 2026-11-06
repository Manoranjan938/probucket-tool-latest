import React, { useEffect, useState } from "react";
import { Dialog, Drawer } from "@mui/material";
import { useSnackbar } from "notistack";

import * as task from "features/tasks/styles/taskClasses";

import TaskDetails, { type DetailsView } from "features/tasks/components/TaskDetails/TaskDetails";
import useGetTaskDetails from "features/tasks/hooks/useGetTaskDetails";
import { toastOptions } from "features/tasks/data";
import { useAppDispatch } from "app/hooks";
import { clearSelectedTask, setSelectedTask } from "features/tasks/store/tasksSlice";

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
  /** Called after the task changed, to reload the board */
  onTaskChanged: () => void;
};

// Loads the open task into the store and shows it in a side panel, or a centered modal when expanded
const TaskDetailsView = ({ sequence, onClose, onOpenTask, onTaskChanged }: Props) => {
  const dispatch = useAppDispatch();
  const [view, setView] = useState<DetailsView>(readView);
  const [, getTaskDetails] = useGetTaskDetails();
  const { enqueueSnackbar } = useSnackbar();

  const loadTask = async (taskSequence: string) => {
    try {
      const resp = await getTaskDetails(taskSequence);
      dispatch(setSelectedTask(resp.data.data));
    } catch (err) {
      console.log(err);
      enqueueSnackbar("Couldn't load the task. Please try again.", { ...toastOptions, variant: "error" });
    }
  };

  useEffect(() => {
    if (sequence) {
      loadTask(sequence);
    }
  }, [sequence]);

  const handleClose = () => {
    onClose();
    dispatch(clearSelectedTask());
  };

  const handleToggleView = () => {
    const next = view === "panel" ? "modal" : "panel";
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // Not remembered, e.g. in a private window
    }
  };

  const handleChanged = () => {
    if (sequence) {
      loadTask(sequence);
    }
    onTaskChanged();
  };

  const content = sequence ? (
    <TaskDetails
      sequence={sequence}
      view={view}
      onToggleView={handleToggleView}
      onClose={handleClose}
      onOpenTask={onOpenTask}
      onChanged={handleChanged}
    />
  ) : null;

  return view === "panel" ? (
    <Drawer
      anchor="right"
      open={Boolean(sequence)}
      onClose={handleClose}
      PaperProps={{ className: task.panelPaper, "aria-label": "Task details" } as object}
      BackdropProps={{ sx: { bgcolor: "rgba(31, 29, 58, 0.25)" } }}
    >
      {content}
    </Drawer>
  ) : (
    <Dialog
      open={Boolean(sequence)}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{ className: task.modalPaper, "aria-label": "Task details" } as object}
    >
      {content}
    </Dialog>
  );
};

export default TaskDetailsView;
