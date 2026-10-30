import Template from "features/projects/components/Template/Template";
import React from "react";

import { data } from 'features/projects/components/Template/data'
import type { WizardStepProps } from 'features/projects/types'

const ChooseTemplate = ({title, details, setDetails, currentPage, setCurrentPage}: WizardStepProps) => {
  return (
    <>
      <div className="h-screen bg-[#efefef] max-[768px]:py-10 max-[768px]:px-[1.3rem]">
        <div className="w-[800px] mx-auto py-[2%] max-[768px]:w-auto max-[768px]:p-0">
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
