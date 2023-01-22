import React from "react";

import "./New.css";

import download from "Images/download.jpg";
import learn from "Images/learning.jpg";

const New = () => {
  return (
    <div className="new__container">
      <h1>New to ProBucket?</h1>
      <p>No problem. We have resources to get you up to speed, quickly.</p>
      <div className="new__cards">
        <div className="new__card">
          <img src={learn} alt="" />
          <div className="new_card_content">
            <h3>Learn Probucket with interactive tutorials.</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio
              amet ipsa laborum, id cum exercitationem suscipit eum minima
            </p>
          </div>
        </div>
        <div className="new__card">
          <img src={download} alt="" />
          <div className="new_card_content">
            <h3>Learn Probucket with interactive tutorials.</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio
              amet ipsa laborum, id cum exercitationem suscipit eum minima
              numquam non quisquam consequatur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
