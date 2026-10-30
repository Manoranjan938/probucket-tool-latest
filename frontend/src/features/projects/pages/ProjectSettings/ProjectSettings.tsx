import React, { useState } from "react";

import image from 'shared/assets/images/avatar1.png'
import { Button, TextField } from "@mui/material";

import './ProjectSettings.css';
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
      <div className="project__setting__container">
        <h2>Project Details</h2>
        <div className="project__setting__details">
          <div className="project__image">
            <img src={image} alt="" />
          </div>
          <div className="project__fields">
            <TextField
              id="outlined-multiline-flexible"
              label="Name"
              fullWidth
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              className="text-field"
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Project Lead"
              fullWidth
              value={project.projectLead}
              className="text-field"
              disabled
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Default Assignee"
              fullWidth
              value={project.defaultAssign}
              className="text-field"
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
