import Button from "shared/components/Button/Button";
import React from "react";


const DataNotFound = ({text}: { text: string }) => {
  return (
    <>
      <div className="w-[480px] p-4 mx-auto">
        <div className="p-4 border-2 border-[#827ED8] rounded-[10px] text-center">
          <span className="text-[20px] font-semibold text-[#827ED8]">
            {text}
          </span>
        </div>
      </div>
    </>
  );
};

export default DataNotFound;
