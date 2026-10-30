import React, { useState } from "react";

import "./CreatUser.css";

import image1 from "Images/new_user.png";
import { Button, Modal, Snackbar, TextField } from "@mui/material";
import { connect } from "react-redux";
import { compose } from "redux";
import { useEffect } from "react";
import useAddTeamMember from "hooks/useAddTeamMember";
import MuiAlert from "@mui/material/Alert";
import useGetTeamMembersList from "hooks/useGetTeamMembersList";
import { getAllTeamMembers } from "apis/Actions/teamActions";
import { useLocation } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreateUser = ({ currentProject, getTeamList }) => {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
  });
  const [error, setError] = useState({
    showEmail: false,
    showName: false,
    message: "",
  });
  const [teamRequest, setTeamRequest] = useState({
    email: "",
    name: "",
    projectId: "",
  });
  const [addTeamMember] = useAddTeamMember();
  const [statusBar, setStatusBar] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    type: "",
    message: "",
  });
  const [popUp, setPopUp] = useState({
    tempPass: false,
    message: "",
  });
  const [teamList, getTeamLists] = useGetTeamMembersList();
  
  let { search } = useLocation();

  const query = new URLSearchParams(search);
  const name = query.get("project");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setStatusBar({ open: false });
  };

  const handleCloseTempPass = () => {
    setPopUp(!popUp);
  };

  const handleAddTeam = (e) => {
    e.preventDefault();
    if (!userData.email && !userData.name) {
      setError({
        showEmail: true,
        showName: true,
        message: "Please fillout this field",
      });
    }
    if (!userData.email) {
      setError({
        showEmail: true,
        showName: false,
        message: "Please fillout this field",
      });
    }
    if (!userData.name) {
      setError({
        showEmail: false,
        showName: true,
        message: "Please fillout this field",
      });
    } else {
      setError({
        showEmail: false,
        showName: false,
        message: "",
      });
      setTeamRequest({
        email: userData.email,
        name: userData.name,
        projectId: currentProject.projectId,
      });
      setUserData({
        email: "",
        name: "",
      });
    }
  };

  useEffect(() => {
    if (teamRequest.email && teamRequest.name && teamRequest.projectId) {
      callAddTeamMember();
    }
  }, [teamRequest]);

  const callAddTeamMember = async () => {
    try {
      const resp = await addTeamMember(teamRequest);

      if (resp.status === 201) {
        callGetTeamMembersList();
        setPopUp({
          tempPass: true,
          message: resp.data,
        });
        
      }
    } catch (err) {
      setStatusBar({
        open: true,
        type: "error",
        message: err.response.data.message,
      });
    }
  };

  const callGetTeamMembersList = async () => {
    await getTeamLists(name);
  };

  useEffect(() => {
    getTeamList(teamList);
  }, [teamList]);

  return (
    <>
      <div className="create_new_user">
        <div className="image">
          <img src={image1} alt="" />
        </div>
        <div className="user_fields">
          <h3>There's a team behind every success</h3>
          <p>Add your team and start creating great things together</p>
          <TextField
            fullWidth
            className="input_form"
            id="outlined-basic"
            label="Email address"
            variant="outlined"
            error={error.showEmail}
            helperText={error.message}
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            className="input_form"
            id="outlined-basic"
            label="User's name"
            variant="outlined"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            error={error.showName}
            helperText={error.message}
          />
          <Button
            variant="contained"
            color="primary"
            className="new_team_btn"
            onClick={handleAddTeam}
          >
            Add Team Member
          </Button>
        </div>
      </div>
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
      <Modal
        open={popUp.tempPass}
        onClose={handleCloseTempPass}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <div className="temp_pass">
          <h4>Team Success</h4>
          <div className="divider" />
          <p>{popUp.message}</p>
          <div className="divider" />
          <span>Copy the temporary password</span>
        </div>
      </Modal>
    </>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    getTeamList: (data) => dispatch(getAllTeamMembers(data)),
  };
}

const mapStateToProps = (state) => ({
  currentProject: state.project.project,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CreateUser);
