import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import useCreateTask from "hooks/useCreateTask";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import "./NewTask.css";

const NewTask = ({ open, setOpen, currentProject }) => {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [error, setError] = useState({
    showNameError: false,
    message: "",
  });
  const [taskRequest, setTaskRequest] = useState({
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
        projectIdentifier: currentProject.projectIdentifier,
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
        <div className="new_task">
          <div className="new_task_header">
            <h3>New Task</h3>
            <i className="fa fa-times-circle-o" onClick={handleClose} />
          </div>
          <div className="divider" />
          <TextField
            fullWidth
            className="input_form"
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
          <div className="divider" />
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

const mapStateToProps = (state) => ({
  currentProject: state.project.project,
});

const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(NewTask);
