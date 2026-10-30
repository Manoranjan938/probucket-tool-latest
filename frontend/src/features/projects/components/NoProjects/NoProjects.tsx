import Button from "shared/components/Button/Button";
import React from "react";

import "./NoProjects.css";

import image from "shared/assets/images/projects.png";
import { useNavigate } from "react-router-dom";

const NoProjects = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create-project");
  };

  return (
    <>
      <div className="no__projects">
        <div className="no__project__wrapper">
          <img src={image} alt="" />
          <h2>You don't have any projects</h2>
          <p>Create a new project to plan, track and release great softwares</p>
          <div className="new_project_btn" onClick={handleClick}>
            <Button title="Create Project" />
          </div>
        </div>
      </div>
    </>
  );
};

export default NoProjects;
