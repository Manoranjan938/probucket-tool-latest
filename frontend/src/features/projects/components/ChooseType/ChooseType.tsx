import React from "react";


import image from "shared/assets/images/project.png";

import { typeData } from "./data";
import { data } from "features/projects/components/Template/data";
import Template from "features/projects/components/Template/Template";
import { Alert } from "@mui/material";
import type { WizardStepProps } from "features/projects/types";

// Keyed by item.type
const headerClasses: Record<string, string> = {
  personal: "text-center border-b-2 border-[#007bff] pb-[15px] text-[#007bff]",
  team: "text-center border-b-2 border-[#827ED8] pb-[15px] text-[#827ED8]",
  company: "text-center border-b-2 border-[#9e73e4] pb-[15px] text-[#9e73e4]",
};

const buttonClasses: Record<string, string> = {
  personal: "w-full my-2.5 py-2 px-5 border-none rounded-[5px] bg-[#007bff] text-[12px] font-semibold text-white cursor-pointer",
  team: "w-full my-2.5 py-2 px-5 border-none rounded-[5px] bg-[#827ED8] text-[12px] font-semibold text-white cursor-pointer",
  company: "w-full my-2.5 py-2 px-5 border-none rounded-[5px] bg-[#9e73e4] text-[12px] font-semibold text-white cursor-pointer",
};

const ChooseType = ({ title, details, setDetails, currentPage, setCurrentPage }: WizardStepProps) => {

  const handleTypeClick = (type: string, typeId: number) => {
    setCurrentPage(currentPage + 1);
    setDetails({...details, projectType: type, projectTypeId: typeId})
  }

  const template = data.find((item) => item.templateId === details.projectTemplateId);

  return (
    <>
      <div className="w-[calc(100%_-_450px)] h-auto mx-auto py-[.8rem] max-[1400px]:w-[calc(100%_-_300px)] max-[560px]:w-full">
        <button
          className="flex items-center bg-transparent border-none outline-none text-[15px] text-[#888] cursor-pointer max-[560px]:w-[100px] max-[560px]:flex"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <i className="fa fa-arrow-left" /> &nbsp;Back to project template
        </button>
        <div className="px-8">
          <h4>Project template</h4>
          {<Template items={template!} />}
        </div>
        <h4 className="ml-[30px]">{title}</h4>
        <Alert severity="warning" className="w-[calc(100%_-_120px)] mx-auto">
          You'll need to create a new project if you want to track
        </Alert>
        <div className="flex justify-center gap-5 w-full max-[768px]:w-[250px] max-[768px]:my-[.5rem] max-[768px]:mx-auto max-[768px]:block max-[560px]:block max-[560px]:my-0 max-[560px]:mx-[5%]">
          {typeData.map((item, index) => {
            return (
              <div className="w-[250px] p-8 max-[768px]:w-full max-[768px]:mb-5" key={index}>
                <div className={headerClasses[item.type]}>
                  <h4>{item.title}</h4>
                </div>
                <div>
                  <div className="flex justify-center w-full">
                    <img src={item.image} alt="" className="w-[300px] h-[200px] my-2.5 mx-auto" />
                  </div>
                  <div className="w-full -m-5">
                    <div className="w-full m-0 py-[.4rem] px-[1.3rem]">
                      <h3 className="text-center">{item.title}</h3>
                      <p className="text-center">{item.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center w-full mt-[30px]">
                  <button
                    className={buttonClasses[item.type]}
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
