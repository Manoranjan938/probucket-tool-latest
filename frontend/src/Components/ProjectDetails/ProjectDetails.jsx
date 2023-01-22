import { Snackbar, TextField } from "@mui/material";
import React, { useState } from "react";
import MuiAlert from "@mui/material/Alert";

import { data } from "Components/TemplateProject/data";
import { typeData } from "Components/ChooseType/data";

import "./ProjectDetails.css";
import Template from "Components/TemplateProject/Template";
import { connect } from "react-redux";
import { compose } from "redux";
import { useEffect } from "react";
import useCreateNewProject from "hooks/useCreateNewProject";
import { useNavigate } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProjectDetails = ({
  currentPage,
  setCurrentPage,
  details,
  setDetails,
  currentUser,
}) => {
  const [projectRequest, setProjectRequest] = useState({
    projectName: "",
    projectTemplate: "",
    projectType: "",
    projectDesc: "",
    userId: "",
  });
  const [error, setError] = useState({
    showNameError: false,
    showDescError: false,
    message: "",
  });
  const [createNewProject] = useCreateNewProject();
  const [notiBar, setNotiBar] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    type: "",
    message: "",
  });

  const navigate = useNavigate();

  const template = data.find(
    (item) => item.templateId === details?.projectTemplateId
  );
  const type = typeData.find(
    (items) => items.typeId === details?.projectTypeId
  );

  const handleProjectDetails = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleGoProjects = () => {
    navigate("/projects")
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotiBar({ open: false });
  };

  const handleCreateProject = () => {
    if (!details.projectName && !details.projectDescription) {
      setError({
        showNameError: true,
        showDescError: true,
        message: "Please fillout this field",
      });
    }
    if (!details.projectName) {
      setError({
        showNameError: true,
        showDescError: false,
        message: "Please fillout this field",
      });
    }
    if (!details.projectDescription) {
      setError({
        showNameError: false,
        showDescError: true,
        message: "Please fillout this field",
      });
    } else {
      setProjectRequest({
        projectName: details.projectName,
        projectDesc: details.projectDescription,
        projectTemplate: details.projectTemplate,
        projectType: details.projectType,
        userId: currentUser.id,
      });
    }
  };

  useEffect(() => {
    if (
      projectRequest.projectName &&
      projectRequest.projectDesc &&
      projectRequest.projectTemplate &&
      projectRequest.projectType
    ) {
      callCreateProject();
    }
  }, [projectRequest]);

  const callCreateProject = async () => {
    try {
      const resp = await createNewProject(projectRequest);
      if(resp.status === 201){
        setNotiBar({
          open: true,
          type: "success",
          message: "Project created successfully",
        });
      }
    } catch (err) {
      console.log(err.response);
      // setNotiBar({
      //   open: true,
      //   type: "error",
      //   message: err.response.data.message,
      // });
    }
  };

  return (
    <>
      <div className="project__details_container">
        <div className="project__details__header">
          <button onClick={handleProjectDetails} className="btn">
            <i className="fa fa-arrow-left" /> &nbsp;Back to project type
          </button>
        </div>
        <div className="project__details__body">
          <div className="project__details__section">
            <div className="header_section">
              <h3>Add project details</h3>
              <span>
                You can change these details anytime in your project setting.
              </span>
            </div>
            <TextField
              fullWidth
              required
              id="outlined-required"
              label="Name"
              className="input-field"
              value={details.projectName}
              onChange={(e) =>
                setDetails({ ...details, projectName: e.target.value })
              }
              error={error.showNameError}
              helperText={error.message}
            />
            <TextField
              fullWidth
              required
              label="Project description"
              className="input-field"
              multiline
              rows={4}
              value={details.projectDescription}
              onChange={(e) =>
                setDetails({ ...details, projectDescription: e.target.value })
              }
              error={error.showDescError}
              helperText={error.message}
            />
          </div>
          <div className="project__details_choose__section">
            <div className="option_template">
              <div className="option_template_header">
                <h4>Template</h4>
                <h4>Change Template</h4>
              </div>
              <div className="option_template_body">
                <Template items={template} />
              </div>
            </div>
            <div className="option_type">
              <div className="option_type_header">
                <h4>Type</h4>
                <h4>Change Type</h4>
              </div>
              <div className="option_type_body">
                <Template items={type} />
              </div>
            </div>
          </div>
        </div>
        <div className="project__details__footer">
          <button className="cancel_btn btn" onClick={handleGoProjects}>Go to Projects</button>
          <button className="btn" onClick={handleCreateProject}>
            Create Project
          </button>
        </div>
      </div>

      <Snackbar
        open={notiBar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        key={notiBar.vertical + notiBar.horizontal}
      >
        <Alert
          onClose={handleClose}
          severity={notiBar.type}
          sx={{ width: "100%" }}
        >
          {notiBar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(ProjectDetails);
