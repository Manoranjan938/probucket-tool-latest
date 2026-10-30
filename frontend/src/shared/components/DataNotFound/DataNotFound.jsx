import Button from "shared/components/Button/Button";
import React from "react";

import "./DataNotFound.css";

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
