import Button from "Components/Button/Button";
import React from "react";

import "./NoProject.css";

import image from "Images/projects.png";
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
