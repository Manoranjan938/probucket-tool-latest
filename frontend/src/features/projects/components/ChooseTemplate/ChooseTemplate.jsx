import Template from "features/projects/components/Template/Template.jsx";
import React from "react";

import './ChooseTemplate.css'
import { data } from 'features/projects/components/Template/data'

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
