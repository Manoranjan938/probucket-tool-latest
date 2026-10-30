import React from "react";


import image from "shared/assets/images/trash.png";

const Empty = () => {
  return (
    <>
      <div className="w-[70%] mx-auto">
        <img src={image} alt="" className="w-full" />
        <div className="text-center">
          <h3 className="text-[26px] font-bold text-[#919191]">Nothing is in trash!!!</h3>
          <p className="text-[17px]">
            Nothing present in your trash. Please check after you delete
            something...!!!
          </p>
        </div>
      </div>
    </>
  );
};

export default Empty;
