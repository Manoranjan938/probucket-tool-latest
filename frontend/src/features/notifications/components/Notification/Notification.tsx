import React from "react";
import { Link } from "react-router-dom";


const Notification = () => {
  return (
    <>
      <div className="flex gap-[30px] w-auto my-[2%] mx-[10%] pb-2.5 border-b border-[#797777]">
        <div className="text-[40px]">
          <i className="fa fa-user" />
        </div>
        <div>
          <div className="flex justify-between w-auto">
            <span className="py-0.5 px-2.5 rounded-[4px] bg-[#02e76d] text-[14px] font-semibold text-white">New Task</span>
            <div className="flex items-center gap-[5px] text-[#9ea0a0]">
              <i className="fa fa-clock-o" />
              <span>2min ago</span>
            </div>
          </div>
          <div className="mt-1.5">
            <h5 className="text-[16px] text-[#6b6e6e]">New Task: Check your email</h5>
            <span className="text-[14px] text-[#818181]">
              You have to check your comapny email
            </span>
          </div>
          <div className="mt-2.5">
            <Link to="#" className="uppercase font-semibold no-underline">See full details</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
