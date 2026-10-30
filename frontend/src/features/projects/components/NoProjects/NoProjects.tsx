import Button from "shared/components/Button/Button";
import React from "react";


import image from "shared/assets/images/projects.png";
import { useNavigate } from "react-router-dom";

const NoProjects = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create-project");
  };

  return (
    <>
      <div className="w-auto overflow-y-hidden h-screen max-[1400px]:my-[5%] max-[1400px]:mx-auto">
        <div className="w-[400px] my-[13%] mx-auto text-center">
          <img src={image} alt="" className="flex w-[200px] h-[200px] my-2.5 mx-auto" />
          <h2 className="text-center text-[22px] font-medium">You don't have any projects</h2>
          <p className="text-center text-[16px]">Create a new project to plan, track and release great softwares</p>
          <div className="flex justify-center mt-5" onClick={handleClick}>
            <Button title="Create Project" />
          </div>
        </div>
      </div>
    </>
  );
};

export default NoProjects;
