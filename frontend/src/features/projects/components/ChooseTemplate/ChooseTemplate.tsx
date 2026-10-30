import Template from "features/projects/components/Template/Template";
import React from "react";

import './ChooseTemplate.css'
import { data } from 'features/projects/components/Template/data'
import type { WizardStepProps } from 'features/projects/types'

const ChooseTemplate = ({title, details, setDetails, currentPage, setCurrentPage}: WizardStepProps) => {
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
