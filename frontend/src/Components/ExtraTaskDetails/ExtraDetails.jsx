import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import TaskStatusCompletion from "Components/TaskCompletionStatus/TaskStatusCompletion";
import useUpdateTask from "hooks/useUpdateTask";
import React, { useState } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import "./ExtraDetails.css";

const ExtraDetails = ({ currentuser, myTeams, currentTask }) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [assignee, setAssignee] = useState("");
  const [updateRequest, setUpdateRequest] = useState({
    taskId: "",
    status: "",
    assignee: "",
    priority: "",
    description: "",
  });
  const [updateTask] = useUpdateTask();

  const handleTaskModal = () => {
    setShowTaskModal(true);
  };

  const handleClose = () => {
    setShowTaskModal(false);
  };

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}`,
    };
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    setUpdateRequest({
      taskId: currentTask.taskSequence,
      status: currentTask.status,
      assignee: assignee.email,
      priority: currentTask.priority,
      description: currentTask.taskDesc,
    });
  }

  const callUpdateTask = async () => {
    try {
      const resp = await updateTask(updateRequest);

      if (resp.status === 200) {
        console.log("Updated successfully");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (
      updateRequest.taskId &&
      updateRequest.assignee &&
      updateRequest.priority &&
      updateRequest.status
    ) {
      callUpdateTask();
    }
  },[updateRequest])

  return (
    <>
      <div className="extra_details_container">
        <div className="task_completion_progress_bars">
          <TaskStatusCompletion task={currentTask} />
        </div>
        <div className="extra_owner_details">
          <div className="owner__details__header">
            <h5>Details</h5>
          </div>
          <div className="owner__details__body">
            <div className="labels">
              <div className="label">Assignee</div>
              <div className="choose_one">
                <span className="unassign">
                  <div className="choose_one">
                    {currentTask != null && (
                      <>
                        {/* <Avatar {...stringAvatar(currentTask.assignee)} /> */}
                        <span className="name">{currentTask.assignee === "NA" ? "Un-Assigned" : currentTask.assignee}</span>
                      </>
                    )}
                  </div>
                </span>
                <span className="change" onClick={handleTaskModal}>
                  Change
                </span>
              </div>
            </div>
            <div className="labels">
              <div className="label">Reporter</div>
              <div className="choose_one">
                <Avatar {...stringAvatar(currentuser.fullName)} />
                <span className="name">{currentuser.fullName}</span>
              </div>
            </div>
            <div className="labels">
              <div className="label">Priority</div>
              <div className="choose_one">
                <span className="unassign">{currentTask.priority}</span>
                {/* <span className="change" onClick={handleTaskModal}>
                  Change
                </span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={showTaskModal}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <div className="task_status_container">
          <div className="task_status_header">
            <h4>Update Assignee and Priority</h4>
            <i className="fa fa-times-circle-o" onClick={handleClose} />
          </div>
          <div className="divider" />
          <div className="task_status_body">
            <Autocomplete
              id="country-select-demo"
              className="fields"
              fullWidth
              value={assignee}
              onChange={(event, value) => {
                setAssignee(value);
              }}
              options={myTeams}
              autoHighlight
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose assignee"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill
                  }}
                />
              )}
            />
            {/* <FormControl fullWidth className="fields">
              <InputLabel id="demo-simple-select-label">Priority</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Priority"
              >
                <MenuItem value="LOW">LOW</MenuItem>
                <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                <MenuItem value="HIGH">HIGH</MenuItem>
              </Select>
            </FormControl> */}
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  currentuser: state.security.user,
  myTeams: state.teams.allTeamMember,
  currentTask: state.tasks.selectedTask,
});

const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(ExtraDetails);
