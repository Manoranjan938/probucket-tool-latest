import Button from "Components/Button/Button";
import React from "react";

import "./DataNot.css";

const DataNotFound = ({text}) => {
  return (
    <>
      <div className="data_not_container">
        <div className="not_found_text">
          <span>
            {text}
          </span>
        </div>
      </div>
    </>
  );
};

export default DataNotFound;
