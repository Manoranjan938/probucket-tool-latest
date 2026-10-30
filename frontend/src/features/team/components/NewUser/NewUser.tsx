import { Avatar, Button, FormControl, InputLabel, MenuItem, Modal, Select, Snackbar, TextField } from "@mui/material";
import { getAllTeamMembers } from "features/team/store/teamActions";
import CreateUser from "features/team/components/CreateUser/CreateUser";
import useGetTeamMembersList from "features/team/hooks/useGetTeamMembersList";
import useUpdateTeamMember from "features/team/hooks/useUpdateTeamMember";
import React, { useEffect, useState } from "react";
import { connect, type ConnectedProps } from "react-redux";
import { useLocation } from "react-router-dom";
import { compose } from "redux";
import type { AxiosError } from "axios";
import type { AppDispatch } from "app/store";
import type { TeamMember, UpdateTeamRequest } from "features/team/types";
import MuiAlert, { type AlertProps } from '@mui/material/Alert';
import type { SnackbarState, ApiError } from "shared/types";

import { divider, formFieldCompact, modalHeader, smallModalCard, smallModalClose } from "shared/styles/sharedClasses";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const NewUser = ({ getTeamList }: Props) => {
  const [teamList, getTeamLists] = useGetTeamMembersList();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [updateTeam, setUpdateTeam] = useState<{ id: number; role: string; status: number | string }>({
    id: 0,
    role: '',
    status: ''
  })
  const [updateRequest, setUpdateRequest] = useState<UpdateTeamRequest>({
    userid: 0,
    role: '',
    status: ''
  })
  const [statusBar, setStatusBar] = useState<SnackbarState>({
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

  const handleTaskModal = (item: TeamMember) => {
    setShowTaskModal(true);
    setUpdateTeam({
      ...updateTeam,
      id: item.userid,
      status: item.status
    })
  };

  const handleUpdateTeam = (e: React.MouseEvent<HTMLButtonElement>) => {
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

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
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
        // TODO(ts-migration): throws when there is no response; if the body is an object, rendering it throws too
        message: (err as AxiosError<string>).response!.data,
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

  return (
    <>
      <div className="w-auto mr-5 px-2.5">
        <CreateUser />
        <div>
          <div className="flex items-center w-auto h-[30px] mt-2.5 p-2.5 border-t border-b border-[#9999] bg-[#c4c4c4] text-white">
            <span className="uppercase text-[17px] font-bold flex items-center w-[400px] my-2.5 max-[1400px]:w-[150px]">User</span>
            <span className="uppercase text-[17px] font-bold w-[180px] max-[1400px]:w-[250px]">Added On</span>
            <span className="uppercase text-[17px] font-bold w-[180px] max-[1400px]:w-[150px]">Status</span>
            <span className="uppercase text-[17px] font-bold w-[180px] max-[1400px]:w-[150px]">Role</span>
            <span className="uppercase text-[17px] font-bold w-[110px] max-[1400px]:w-[120px]">Action</span>
          </div>
          <div>
            {teamList.map((item, index) => (
              <div className="flex items-center p-2.5" key={index}>
                <div className="flex items-center w-[400px] my-2.5 max-[1400px]:w-[150px] gap-5">
                  <Avatar {...stringAvatar(item.name)} />
                  <div>
                    <span>{item.name}</span>
                    <p className="text-[14px]">{item.email}</p>
                  </div>
                </div>
                <div className="w-[180px] max-[1400px]:w-[250px]">
                  <span>21-05-2022</span>
                </div>
                <div className="w-[180px] max-[1400px]:w-[150px]">
                  <span>
                    {item.status === 0 ? "Active" : "In-Active"}
                  </span>
                </div>
                <div className="w-[180px] max-[1400px]:w-[150px]">
                  <span>
                    {item.role === null || item.role === "null"
                      ? "Not Added"
                      : item.role}
                  </span>
                </div>
                <div
                  className="w-[110px] max-[1400px]:w-[120px] text-[#2ea5fbdd] cursor-pointer"
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
        <div className={smallModalCard}>
          <div className={modalHeader}>
            <h4 className="m-0">Update Assignee and Priority</h4>
            <i className={`fa fa-times-circle-o ${smallModalClose}`} onClick={handleTaskClose} />
          </div>
          <div className={divider} />
          <div>
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
            <FormControl fullWidth className={formFieldCompact}>
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
    getTeamList: (data: TeamMember[]) => dispatch(getAllTeamMembers(data)),
  };
}

const withConnect = connect(null, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(NewUser);
