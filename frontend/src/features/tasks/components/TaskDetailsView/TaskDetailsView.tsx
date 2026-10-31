import React, { useEffect, useState } from "react";
import { Dialog, Drawer } from "@mui/material";
import { useSnackbar } from "notistack";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";

import * as task from "features/tasks/styles/taskClasses";

import TaskDetails, { type DetailsView } from "features/tasks/components/TaskDetails/TaskDetails";
import useGetTaskDetails from "features/tasks/hooks/useGetTaskDetails";
import { getSingleTask, removeSelectedTask } from "features/tasks/store/taskAction";
import { toastOptions } from "features/tasks/data";
import type { AppDispatch } from "app/store";
import type { TaskDetails as TaskDetailsData } from "features/tasks/types";

// Side panel or modal – the last choice is remembered in this browser
const VIEW_KEY = "probucket.taskDetailsView";

const readView = (): DetailsView => {
  try {
    return localStorage.getItem(VIEW_KEY) === "modal" ? "modal" : "panel";
  } catch {
    return "panel";
  }
};

type OwnProps = {
  /** Sequence of the task to show; null when closed */
  sequence: string | null;
  onClose: () => void;
  /** Called after the task changed, to reload the board */
  onTaskChanged: () => void;
};

// Loads the open task into the store and shows it in a side panel, or a centered modal when expanded
const TaskDetailsView = ({ sequence, onClose, onTaskChanged, setTask, removeTask }: OwnProps & Props) => {
  const [view, setView] = useState<DetailsView>(readView);
  const [, getTaskDetails] = useGetTaskDetails();
  const { enqueueSnackbar } = useSnackbar();

  const loadTask = async (taskSequence: string) => {
    try {
      const resp = await getTaskDetails(taskSequence);
      setTask(resp.data);
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
    removeTask();
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

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    setTask: (data: Partial<TaskDetailsData>) => dispatch(getSingleTask(data)),
    removeTask: () => dispatch(removeSelectedTask()),
  };
}

const withConnect = connect(null, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(TaskDetailsView);
