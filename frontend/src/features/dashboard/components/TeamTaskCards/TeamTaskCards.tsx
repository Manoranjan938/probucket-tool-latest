import React, { useEffect } from "react";

import { MdPendingActions, MdOutlineTask } from "react-icons/md";
import { BiTask, BiTaskX } from "react-icons/bi";

import useGetHomeCountDatas from "features/dashboard/hooks/useGetHomeCountDatas";
import { useLocation } from "react-router-dom";

const TeamTaskCards = () => {

  const [homeDatas, getHomeCountData] = useGetHomeCountDatas();

  let { search } = useLocation();

  const query = new URLSearchParams(search);
  const param = query.get("project");

  useEffect(() => {
    getHomeCountData(param);
  }, [param])

  return (
    <>
      <div className="grid grid-cols-[repeat(4,1fr)] gap-3.5 mt-5 mr-5">
        <div className="flex justify-between items-center p-4 border border-[#e5e5e5] rounded-[10px] bg-[#f9aa60]">
          <div className="text-[30px] text-white">
            <MdOutlineTask />
          </div>
          <div className="text-center">
            <h3 className="text-[20px] text-white">{homeDatas.total}</h3>
            <h5 className="text-[14px] font-medium text-white">Total Tasks</h5>
          </div>
        </div>
        <div className="flex justify-between items-center p-4 border border-[#e5e5e5] rounded-[10px] bg-[#04cb52]">
          <div className="text-[30px] text-white">
            <BiTask />
          </div>
          <div className="text-center">
            <h3 className="text-[20px] text-white">{homeDatas.completed}</h3>
            <h5 className="text-[14px] font-medium text-white">Completed Tasks</h5>
          </div>
        </div>
        <div className="flex justify-between items-center p-4 border border-[#e5e5e5] rounded-[10px] bg-[#39a1f0]">
          <div className="text-[30px] text-white">
            <MdPendingActions />
          </div>
          <div className="text-center">
            <h3 className="text-[20px] text-white">{homeDatas.inprogress}</h3>
            <h5 className="text-[14px] font-medium text-white">On Going Tasks</h5>
          </div>
        </div>
        <div className="flex justify-between items-center p-4 border border-[#e5e5e5] rounded-[10px] bg-[#fc6464]">
          <div className="text-[30px] text-white">
            <BiTaskX />
          </div>
          <div className="text-center">
            <h3 className="text-[20px] text-white">{homeDatas.pending}</h3>
            <h5 className="text-[14px] font-medium text-white">Not Completed Tasks</h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamTaskCards;
