import ChooseTemplate from "Components/ChooseTemplate/TemplateChoose";
import ChooseType from "Components/ChooseType/Type";
import ProjectDetails from "Components/ProjectDetails/ProjectDetails";
import React, { useState } from "react";

import "./NewProject.css";

const NewProject = () => {
  const [page, setPage] = useState(0);
  const [projectDetails, setProjectDetails] = useState({
    projectTemplate: '',
    projectType: '',
    projectName: 'Your project name',
    projectDescription: 'Your project description',
    projectTemplateId: 0,
    projectTypeId: 0
  })
  const formTitles = [
    "Choose Type of Template",
    "Choose Managed By",
    "Add Project Details",
  ];

  const pageDisplay = () => {
    if (page === 0) {
      return (
        <ChooseTemplate
          title={formTitles[page]}
          details={projectDetails}
          setDetails={setProjectDetails}
          currentPage={page}
          setCurrentPage={setPage}
        />
      );
    }
    else if(page === 1){
      return (
        <ChooseType
          title={formTitles[page]}
          details={projectDetails}
          setDetails={setProjectDetails}
          currentPage={page}
          setCurrentPage={setPage}
        />
      );
    }
    else{
      return (
        <ProjectDetails
          title={formTitles[page]}
          details={projectDetails}
          setDetails={setProjectDetails}
          currentPage={page}
          setCurrentPage={setPage}
        />
      );
    }
  };

  return (
    <>
      {pageDisplay()}
    </>
  );
};

export default NewProject;
