import React from "react";

import "./Type.css";

import image from "Images/project.png";

import { typeData } from "./data";
import { data } from "Components/TemplateProject/data";
import Template from "Components/TemplateProject/Template";
import { Alert } from "@mui/material";

const ChooseType = ({ title, details, setDetails, currentPage, setCurrentPage }) => {

  const handleTypeClick = (type, typeId) => {
    setCurrentPage(currentPage + 1);
    setDetails({...details, projectType: type, projectTypeId: typeId})
  }

  const template = data.find((item) => item.templateId === details.projectTemplateId);

  return (
    <>
      <div className="project__type">
        <button
          className="back_btn"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <i className="fa fa-arrow-left" /> &nbsp;Back to project template
        </button>
        <div className="choosenTemplate">
          <h4>Project template</h4>
          {<Template items={template} />}
        </div>
        <h4>{title}</h4>
        <Alert severity="warning" className="project__alert">
          You'll need to create a new project if you want to track
        </Alert>
        <div className="project__type__container">
          {typeData.map((item, index) => {
            return (
              <div className="project__type__wrapper" key={index}>
                <div className={`type_${item.type}_header`}>
                  <h4>{item.title}</h4>
                </div>
                <div className="type__body">
                  <div className="type_image_container">
                    <img src={item.image} alt="" />
                  </div>
                  <div className="type_container">
                    <div className="type_content">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </div>
                <div className="type_footer">
                  <button
                    className={`type_${item.type}_btn`}
                    onClick={() => handleTypeClick(item.type, item.typeId)}
                  >
                    Select a {item.title.toLowerCase()} project
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ChooseType;
