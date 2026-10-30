import React from 'react'
import type { Dispatch, SetStateAction } from 'react'

import './Template.css'
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
          className="project__template__contaier"
          onClick={() => handleClick(items.type)}
        >
          <div className="image_container">
            <img src={items.image} alt="" />
          </div>
          <div className="content_container">
            <div className="content">
              <h3>{items.title}</h3>
              <p>{items.description}</p>
            </div>
            <div className="icon">
              <i className="fa fa-chevron-right" />
            </div>
          </div>
        </div>
      </>
    );
}

export default Template
