import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

import "./TeamMemNotification.css";

const TeamMemberNotification = () => {
  const navigate = useNavigate();

  const newMember = () => {
    navigate("/project/team/new-user");
  };

  return (
    <>
      <div className="team_member_noti_container">
        <div className="noti_container">
          <i className="fa fa-exclamation-circle" />
          <span>
            You don't have any team members. To work with team add some team
            members.
          </span>
        </div>
        <Button variant="contained" color="primary" onClick={newMember}>
          Add Team Member
        </Button>
      </div>
    </>
  );
};

export default TeamMemberNotification;
