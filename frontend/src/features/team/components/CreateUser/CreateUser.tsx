import React, { useState } from "react";

import "./CreateUser.css";

import image1 from "shared/assets/images/new_user.png";
import { Button, Modal, Snackbar, TextField } from "@mui/material";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import { useEffect } from "react";
import useAddTeamMember from "features/team/hooks/useAddTeamMember";
import MuiAlert, { type AlertProps } from "@mui/material/Alert";
import type { SnackbarState, ApiError } from "shared/types";
import useGetTeamMembersList from "features/team/hooks/useGetTeamMembersList";
import { getAllTeamMembers } from "features/team/store/teamActions";
import { useLocation } from "react-router-dom";
import type { AppDispatch, RootState } from "app/store";
import type { AddTeamMemberRequest, TeamMember } from "features/team/types";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CreateUser = ({ currentProject, getTeamList }: Props) => {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
  });
  const [error, setError] = useState({
    showEmail: false,
    showName: false,
    message: "",
  });
  const [teamRequest, setTeamRequest] = useState<AddTeamMemberRequest>({
    email: "",
    name: "",
    projectId: "",
  });
  const [addTeamMember] = useAddTeamMember();
  const [statusBar, setStatusBar] = useState<SnackbarState>({
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

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setStatusBar({ open: false });
  };

  const handleCloseTempPass = () => {
    // TODO(ts-migration): replaces the popUp object with `false`, so popUp.tempPass becomes undefined
    // (the modal still closes because undefined is falsy)
    // @ts-expect-error popUp is an object, not a boolean
    setPopUp(!popUp);
  };

  const handleAddTeam = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        projectId: currentProject.projectId!,
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
        // TODO(ts-migration): throws inside the catch when there is no response (e.g. network error)
        message: (err as ApiError).response!.data.message,
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

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getTeamList: (data: TeamMember[]) => dispatch(getAllTeamMembers(data)),
  };
}

const mapStateToProps = (state: RootState) => ({
  currentProject: state.project.project,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(CreateUser);
