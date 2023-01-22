import { Avatar, Button, FormControl, InputLabel, MenuItem, Modal, Select, Snackbar, TextField } from "@mui/material";
import { getAllTeamMembers } from "apis/Actions/teamActions";
import CreateUser from "Components/CreateUser/CreateUser";
import useGetTeamMembersList from "hooks/useGetTeamMembersList";
import useUpdateTeamMember from "hooks/useUpdateTeamMember";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { compose } from "redux";
import MuiAlert from '@mui/material/Alert'

import "./NewUser.css";

const Alert = React.forwardRef(function Alert(props, ref){
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const NewUser = ({ getTeamList }) => {
  const [teamList, getTeamLists] = useGetTeamMembersList();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [updateTeam, setUpdateTeam] = useState({
    id: 0,
    role: '',
    status: ''
  })
  const [updateRequest, setUpdateRequest] = useState({
    userid: 0,
    role: '',
    status: ''
  })
  const [statusBar, setStatusBar] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'right',
    type: '',
    message: ''
  });
  const [updateTeamMember] = useUpdateTeamMember();

  let { search } = useLocation();

  const query = new URLSearchParams(search);
  const name = query.get("project");

  const handleTaskModal = (item) => {
    setShowTaskModal(true);
    setUpdateTeam({
      ...updateTeam,
      id: item.userid,
      status: item.status
    })
  };

  const handleUpdateTeam = (e) => {
    e.preventDefault();
    setUpdateRequest({
      userid: updateTeam.id,
      role: updateTeam.role,
      status: updateTeam.status
    })
    setUpdateTeam({
      ...updateTeam,
      role: ""
    });
  }

  const handleClose = (event, reason) => {
    if(reason === 'clickaway'){
      return;
    }
    setStatusBar({open: false});
  }

  useEffect(() => {
    if(updateRequest.userid && updateRequest.role){
      callUpdateTeam();
    }
  }, [updateRequest])

  const callUpdateTeam = async() => {
    try{
      const resp = await updateTeamMember(updateRequest)

      if(resp.status === 200){
        setStatusBar({
          open: true,
          type: "success",
          message: resp.data,
        });
      }
    }catch(err){
      setStatusBar({
        open: true,
        type: "error",
        message: err.response.data,
      });
    }
  }

  const handleTaskClose = () => {
    setShowTaskModal(false);
  };

  useEffect(() => {
    callGetTeamMembersList();
  }, []);

  const callGetTeamMembersList = async () => {
    await getTeamLists(name);
  };

  useEffect(() => {
    getTeamList(teamList);
  }, [teamList]);

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

  return (
    <>
      <div className="new_user_container">
        <CreateUser />
        <div className="new_user_contents">
          <div className="new_user__header">
            <span className="user">User</span>
            <span className="last_active">Added On</span>
            <span className="status">Status</span>
            <span className="role">Role</span>
            <span className="action">Action</span>
          </div>
          <div className="new_user__body">
            {teamList.map((item, index) => (
              <div className="new_user_row" key={index}>
                <div className="user user_names">
                  <Avatar {...stringAvatar(item.name)} />
                  <div className="user_details">
                    <span className="user_name">{item.name}</span>
                    <p className="user_email">{item.email}</p>
                  </div>
                </div>
                <div className="last_active">
                  <span>21-05-2022</span>
                </div>
                <div className="status">
                  <span className="status_text">
                    {item.status === 0 ? "Active" : "In-Active"}
                  </span>
                </div>
                <div className="role">
                  <span>
                    {item.role === null || item.role === "null"
                      ? "Not Added"
                      : item.role}
                  </span>
                </div>
                <div
                  className="action actn_btn"
                  onClick={() => handleTaskModal(item)}
                >
                  <span>Edit Details</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        open={showTaskModal}
        onClose={handleTaskClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <div className="task_status_container">
          <div className="task_status_header">
            <h4>Update Assignee and Priority</h4>
            <i className="fa fa-times-circle-o" onClick={handleTaskClose} />
          </div>
          <div className="divider" />
          <div className="task_status_body">
            <TextField
              fullWidth
              id="outlined-basic"
              label="Member Role"
              variant="outlined"
              value={updateTeam.role}
              onChange={(e) =>
                setUpdateTeam({ ...updateTeam, role: e.target.value })
              }
            />
            <FormControl fullWidth className="fields">
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Priority"
                value={updateTeam.status}
                onChange={(e) =>
                  setUpdateTeam({ ...updateTeam, status: e.target.value })
                }
              >
                <MenuItem value={0}>Active</MenuItem>
                <MenuItem value={1}>In-Active</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateTeam}
            >
              Update
            </Button>
          </div>
        </div>
      </Modal>
      <Snackbar
        open={statusBar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        key={statusBar.vertical + statusBar.horizontal}
      >
        <Alert
          onClose={handleClose}
          severity={statusBar.type}
          sx={{ width: "100%" }}
        >
          {statusBar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    getTeamList: (data) => dispatch(getAllTeamMembers(data)),
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(NewUser);
