import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import useCreateNewSubtask from "features/tasks/hooks/useCreateNewSubtask";
import React, { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import MuiAlert, { type AlertProps } from "@mui/material/Alert";
import type { SnackbarState } from "shared/types";
import { useEffect } from "react";
import useGetSubTasks from "features/tasks/hooks/useGetSubTasks";
import { setSubtaskList } from "features/tasks/store/taskAction";
import type { AppDispatch, RootState } from "app/store";
import type { CreateSubtaskRequest, Subtask } from "features/tasks/types";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type OwnProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const NewSubTask = ({ open, setOpen, currentProject, currentTask, setSubtasks }: OwnProps & Props) => {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [error, setError] = useState({
    showNameError: false,
    message: "",
  });
  const [taskRequest, setTaskRequest] = useState<CreateSubtaskRequest>({
    projectId: "",
    parentTaskId: "",
    taskName: "",
    priority: "",
    status: "",
  });
  const [statusBar, setStatusBar] = useState<SnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    type: "",
    message: "",
  });
  const [createNewSubtask] = useCreateNewSubtask();
  const [subtasks, getSubtaskList] = useGetSubTasks();
  
  const handleSubTaskClose = () => {
    setOpen(false);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if(reason === 'clickaway'){
      return;
    }
    setStatusBar({open: false});
  }

  const handleCreateSubTask = () => {
    if (!taskName) {
      setError({
        showNameError: true,
        message: "Please fill out this field",
      });
    } else {
      setTaskRequest({
        projectId: currentProject.projectIdentifier!,
        parentTaskId: currentTask.taskSequence!,
        taskName: taskName,
        priority: priority,
        status: "",
      });
      setTaskName("");
      setPriority("LOW");
    }
  };

  useEffect(() => {
    if (
      taskRequest.projectId &&
      taskRequest.parentTaskId &&
      taskRequest.taskName &&
      taskRequest.priority
    ) {
      callCreateSubTask();
    }
  }, [taskRequest]);

  const callCreateSubTask = async () => {
    try {
      const resp = await createNewSubtask(taskRequest);
      if (resp.status === 201) {
        callGetSubtaskLists();
        setStatusBar({
          open: true,
          type: "success",
          message: resp.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    callGetSubtaskLists();
  }, []);

  useEffect(() => {
    setSubtasks(subtasks);
  }, [subtasks]);

  const callGetSubtaskLists = async () => {
    try {
      await getSubtaskList(currentTask.taskSequence);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleSubTaskClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <div className="new_task">
          <div className="new_task_header">
            <h3>New SubTask</h3>
            <i className="fa fa-times-circle-o" onClick={handleSubTaskClose} />
          </div>
          <div className="divider" />
          <TextField
            fullWidth
            className="input_form"
            id="outlined-multiline-static"
            label="About subtask..."
            multiline
            rows={4}
            // TODO(ts-migration): stray "q" prop (typo) – not a TextField prop, it ends up on the DOM
            // @ts-expect-error "q" is not a TextField prop
            q
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            error={error.showNameError}
            helperText={error.message}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Priority</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="LOW">LOW</MenuItem>
              <MenuItem value="MEDIUM">MEDIUM</MenuItem>
              <MenuItem value="HIGH">HIGH</MenuItem>
            </Select>
          </FormControl>
          <div className="divider" />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateSubTask}
          >
            Add
          </Button>
        </div>
      </Modal>
      <Snackbar
        open={statusBar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        // TODO(ts-migration): the setStatusBar calls drop vertical/horizontal, so this key changes on the first update and the Snackbar remounts
        key={`${statusBar.vertical}${statusBar.horizontal}`}
      >
        <Alert
          onClose={handleClose}
          severity={statusBar.type || undefined}
          sx={{ width: "100%" }}
        >
          {statusBar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    setSubtasks: (data: Subtask[]) => dispatch(setSubtaskList(data)),
  };
}

const mapStateToProps = (state: RootState) => ({
  currentProject: state.project.project,
  currentTask: state.tasks.selectedTask,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(NewSubTask);
