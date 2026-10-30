import React from 'react'
import type { Dispatch, SetStateAction } from 'react'

import type { ProjectDraft, TemplateCard } from 'features/projects/types'

interface TemplateProps {
  items: TemplateCard;
  nextPage?: Dispatch<SetStateAction<number>>;
  currentPage?: number;
  details?: ProjectDraft;
  setDetails?: Dispatch<SetStateAction<ProjectDraft>>;
}

const Template = ({nextPage, currentPage, details, setDetails, items}: TemplateProps) => {

  // TODO(ts-migration): only ChooseTemplate passes nextPage/currentPage/details/setDetails. ChooseType and
  // ProjectDetails render <Template items={...} /> alone, so clicking the card there throws.
  const handleClick = (type: string) => {
    nextPage!(currentPage! + 1)
    setDetails!({...details!, projectTemplate: type, projectTemplateId: items.templateId!})
  }

    return (
      <>
        <div
          className="flex w-full h-[160px] mb-5 rounded-xl shadow-[1px_1px_5px_1px_#0003] cursor-pointer"
          onClick={() => handleClick(items.type)}
        >
          <div className="w-[250px] -mr-2.5 bg-[#efeeef]">
            <img src={items.image} alt="" className="w-full h-[150px] rounded-tl-xl" />
          </div>
          <div className="flex justify-between items-center w-full ml-2.5 bg-white rounded-tr-xl rounded-br-xl">
            <div className="w-[80%] ml-5 max-[768px]:w-[70%]">
              <h3>{items.title}</h3>
              <p>{items.description}</p>
            </div>
            <div className="flex py-2 px-1.5 mr-5">
              <i className="fa fa-chevron-right" />
            </div>
          </div>
        </div>
      </>
    );
}

export default Template
