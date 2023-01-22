import React from "react";

import "./Error.css";

import image from "Images/error-page.png";

const Error = () => {
  return (
    <>
      <div className="error__container">
        <div className="error__image">
          <img src={image} alt="" />
        </div>
        <div className="error__content">
          <h1>Page Not Found</h1>
          <h5>
            The page you're looking for might be removed, renamed or might never
            exist on this world.
          </h5>
        </div>
        <div className="error__footer">
          <button className="error_page_btn">Goto to Home</button>
          <button className="error_page_btn">Contact Aliens for Help</button>
        </div>
      </div>
    </>
  );
};

export default Error;
