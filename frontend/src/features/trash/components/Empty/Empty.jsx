import React from "react";

import './Empty.css'

import image from "Images/trash.png";

const Empty = () => {
  return (
    <>
      <div className="trash__container">
        <img src={image} alt="" />
        <div className="trash__content">
          <h3>Nothing is in trash!!!</h3>
          <p>
            Nothing present in your trash. Please check after you delete
            something...!!!
          </p>
        </div>
      </div>
    </>
  );
};

export default Empty;
