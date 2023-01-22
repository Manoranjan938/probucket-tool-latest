import React from 'react'

import './Template.css'

const Template = ({nextPage, currentPage, details, setDetails, items}) => {

  const handleClick = (type) => {
    nextPage(currentPage + 1)
    setDetails({...details, projectTemplate: type, projectTemplateId: items.templateId})
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
