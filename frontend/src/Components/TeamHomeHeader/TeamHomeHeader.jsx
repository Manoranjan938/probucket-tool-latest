import { Autocomplete, Button, TextField } from "@mui/material";
import React from "react";

import "./TeamHomeHeader.css";

const sprints = [
  { label: "Sprint-1" },
  { label: "Sprint-2" },
  { label: "Sprint-3" },
  { label: "Sprint-4" },
];

const TeamHomeHeader = () => {
  return (
    <>
      <div className="team_home_header_container">
        <div className="teams_sprint">
          <Autocomplete
            fullWidth
            disablePortal
            id="combo-box-demo"
            options={sprints}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Sprint" />}
          />
        </div>
        <div className="new_sprint">
          <Button variant="contained" color="primary">
            Create New Sprint
          </Button>
        </div>
      </div>
    </>
  );
};

export default TeamHomeHeader;
