import Template from "Components/TemplateProject/Template.jsx";
import React from "react";

import './ChooseTemplate.css'
import { data } from '../TemplateProject/data'

const ChooseTemplate = ({title, details, setDetails, currentPage, setCurrentPage}) => {
  return (
    <>
      <div className="create__project__container">
        <div className="wrapper">
          <h4>{title}</h4>
          {data.map((item, index) => (
            <Template
              nextPage={setCurrentPage}
              currentPage={currentPage}
              details={details}
              setDetails={setDetails}
              key={index}
              items={item}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ChooseTemplate;
