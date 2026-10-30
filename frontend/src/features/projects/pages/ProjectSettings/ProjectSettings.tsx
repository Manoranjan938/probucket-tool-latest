import React, { useState } from "react";

import image from 'shared/assets/images/avatar1.png'
import { Button, TextField } from "@mui/material";

import { compose } from "redux";
import { connect, type ConnectedProps } from "react-redux";
import type { RootState } from "app/store";

const ProjectSettings = ({ currentProject }: Props) => {
  const [project, setProject] = useState({
    name: currentProject.projectName,
    projectLead: currentProject.leadBy,
    defaultAssign: currentProject.leadBy,
  });

  return (
    <>
      <div className="w-auto px-5">
        <h2>Project Details</h2>
        <div className="flex items-center gap-2.5 w-[500px] mt-5 mx-auto mb-0 p-2.5 border border-[#888] rounded-[6px]">
          <div>
            <img src={image} alt="" className="object-cover w-[170px] h-[170px]" />
          </div>
          <div>
            <TextField
              id="outlined-multiline-flexible"
              label="Name"
              fullWidth
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              className="rounded-[3px] mb-2.5!"
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Project Lead"
              fullWidth
              value={project.projectLead}
              className="rounded-[3px] mb-2.5!"
              disabled
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Default Assignee"
              fullWidth
              value={project.defaultAssign}
              className="rounded-[3px] mb-2.5!"
              disabled
            />
            <Button variant="contained">Save</Button>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentProject: state.project.project,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(ProjectSettings);
