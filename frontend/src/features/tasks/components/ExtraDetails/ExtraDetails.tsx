import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import TaskStatusCompletion from "features/tasks/components/TaskStatusCompletion/TaskStatusCompletion";
import useUpdateTask from "features/tasks/hooks/useUpdateTask";
import React, { useState } from "react";
import { useEffect } from "react";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import type { RootState } from "app/store";
import type { TeamMember } from "features/team/types";
import type { UpdateTaskRequest } from "features/tasks/types";

import { divider, formFieldCompact, modalHeader, smallModalCard, smallModalClose } from "shared/styles/sharedClasses";

const ExtraDetails = ({ currentuser, myTeams, currentTask }: Props) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  // TODO(ts-migration): starts as "" – not a valid Autocomplete option (MUI warns), and handleUpdate reads
  // assignee.email, which is undefined for "" and throws once the field is cleared (null)
  const [assignee, setAssignee] = useState<TeamMember | "" | null>("");
  const [updateRequest, setUpdateRequest] = useState<UpdateTaskRequest>({
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

  function stringToColor(string: string) {
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

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}`,
    };
  }

  const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setUpdateRequest({
      taskId: currentTask.taskSequence!,
      status: currentTask.status!,
      assignee: (assignee as TeamMember).email,
      priority: currentTask.priority!,
      description: currentTask.taskDesc!,
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
      <div>
        <div>
          <TaskStatusCompletion task={currentTask} />
        </div>
        <div className="w-auto mt-2.5 border border-[#999] rounded-[10px]">
          <div className="p-4 border-b border-[#999]">
            <h5 className="text-[16px]">Details</h5>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-[1.5fr_2fr] my-2.5">
              <div className="flex flex-1">Assignee</div>
              <div className="flex items-center gap-3">
                <span>
                  <div className="flex items-center gap-3">
                    {currentTask != null && (
                      <>
                        {/* <Avatar {...stringAvatar(currentTask.assignee)} /> */}
                        <span>{currentTask.assignee === "NA" ? "Un-Assigned" : currentTask.assignee}</span>
                      </>
                    )}
                  </div>
                </span>
                <span className="text-[14px] font-semibold text-[#00f] cursor-pointer" onClick={handleTaskModal}>
                  Change
                </span>
              </div>
            </div>
            <div className="grid grid-cols-[1.5fr_2fr] my-2.5">
              <div className="flex flex-1">Reporter</div>
              <div className="flex items-center gap-3">
                <Avatar {...stringAvatar(currentuser.fullName!)} />
                <span>{currentuser.fullName}</span>
              </div>
            </div>
            <div className="grid grid-cols-[1.5fr_2fr] my-2.5">
              <div className="flex flex-1">Priority</div>
              <div className="flex items-center gap-3">
                <span>{currentTask.priority}</span>
                {/* <span className="text-[14px] font-semibold text-[#00f] cursor-pointer" onClick={handleTaskModal}>
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
        <div className={smallModalCard}>
          <div className={modalHeader}>
            <h4 className="m-0">Update Assignee and Priority</h4>
            <i className={`fa fa-times-circle-o ${smallModalClose}`} onClick={handleClose} />
          </div>
          <div className={divider} />
          <div>
            <Autocomplete
              id="country-select-demo"
              className={formFieldCompact}
              fullWidth
              value={assignee as TeamMember | null}
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
            {/* <FormControl fullWidth className={formFieldCompact}>
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

const mapStateToProps = (state: RootState) => ({
  currentuser: state.security.user,
  myTeams: state.teams.allTeamMember,
  currentTask: state.tasks.selectedTask,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(ExtraDetails);
