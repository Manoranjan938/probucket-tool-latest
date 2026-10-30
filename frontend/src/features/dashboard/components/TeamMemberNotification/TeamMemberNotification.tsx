import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";


const TeamMemberNotification = () => {
  const navigate = useNavigate();

  const newMember = () => {
    navigate("/project/team/new-user");
  };

  return (
    <>
      <div className="flex justify-between mt-5 mb-2.5 mr-5 p-4 rounded-[10px] bg-[#fee8c8]">
        <div className="flex items-center gap-2.5 text-[18px]">
          <i className="fa fa-exclamation-circle" />
          <span className="text-[18px] font-semibold">
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
