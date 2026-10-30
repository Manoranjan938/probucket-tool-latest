import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import useCreateTask from "features/tasks/hooks/useCreateTask";
import React, { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import type { RootState } from "app/store";
import type { ProjectTaskRequest } from "features/tasks/types";

import { divider, formField, modalCard, modalClose, modalHeader } from "shared/styles/sharedClasses";

type OwnProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const NewTask = ({ open, setOpen, currentProject }: OwnProps & Props) => {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [error, setError] = useState({
    showNameError: false,
    message: "",
  });
  const [taskRequest, setTaskRequest] = useState<ProjectTaskRequest>({
    projectIdentifier: "",
    taskName: "",
    priority: "",
    sprintId: "",
    status: "",
  });
  const [createProjectTask] = useCreateTask();

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateTask = () => {
    if (!taskName) {
      setError({
        showNameError: true,
        message: "Please fill out this field",
      });
    } else {
      setTaskRequest({
        projectIdentifier: currentProject.projectIdentifier!,
        taskName: taskName,
        priority: priority,
        sprintId: "",
        status: "",
      });
      setTaskName("");
      setPriority("LOW");
    }
  };

  useEffect(() => {
    if (
      taskRequest.taskName &&
      taskRequest.priority &&
      taskRequest.projectIdentifier
    ) {
      callCreateTask();
    }
  }, [taskRequest]);

  const callCreateTask = async () => {
    try {
      const resp = await createProjectTask(taskRequest);
      if (resp.status === 201) {
        console.log("Task Created");
        setOpen(!open)
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <div className={modalCard}>
          <div className={modalHeader}>
            <h3>New Task</h3>
            <i className={`fa fa-times-circle-o ${modalClose}`} onClick={handleClose} />
          </div>
          <div className={divider} />
          <TextField
            fullWidth
            className={formField}
            id="outlined-multiline-static"
            label="About task..."
            multiline
            rows={4}
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
          <div className={divider} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateTask}
          >
            Add
          </Button>
        </div>
      </Modal>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentProject: state.project.project,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(NewTask);
