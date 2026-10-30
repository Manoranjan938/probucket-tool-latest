import { Autocomplete, Button, TextField } from "@mui/material";
import React from "react";


const sprints = [
  { label: "Sprint-1" },
  { label: "Sprint-2" },
  { label: "Sprint-3" },
  { label: "Sprint-4" },
];

const TeamHomeHeader = () => {
  return (
    <>
      <div className="flex justify-between items-center mr-5 p-4 rounded-[10px] bg-[#efefef]">
        <div className="w-[400px]">
          <Autocomplete
            fullWidth
            disablePortal
            id="combo-box-demo"
            options={sprints}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Sprint" />}
          />
        </div>
        <div>
          <Button variant="contained" color="primary">
            Create New Sprint
          </Button>
        </div>
      </div>
    </>
  );
};

export default TeamHomeHeader;
