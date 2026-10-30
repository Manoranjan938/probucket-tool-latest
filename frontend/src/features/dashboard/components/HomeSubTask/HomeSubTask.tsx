import React from "react";


const HomeSubTask = () => {

  const truncate = (string: string, n: number) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  return (
    <>
      <div className="w-auto px-2.5">
        <h1>Subtask Component</h1>
        <div>
          <div className="flex w-auto mt-2.5 p-2.5 border-t border-b border-[#9999] bg-[#4effbb] text-white">
            <span className="uppercase text-[17px] font-bold flex items-center w-[150px]">Status</span>
            <span className="uppercase text-[17px] font-bold w-[320px] max-[1400px]:w-[250px]">SubTask Name</span>
            <span className="uppercase text-[17px] font-bold flex items-center gap-2.5 w-[170px] ml-[5px] max-[1400px]:w-[150px]">Priority</span>
            <span className="uppercase text-[17px] font-bold w-[200px] max-[1400px]:w-[150px]">Created On</span>
            <span className="uppercase text-[17px] font-bold w-[180px] max-[1400px]:w-[150px]">Completed By</span>
            <span className="uppercase text-[17px] font-bold w-[120px] ml-[5px]">Parent Task</span>
          </div>
          <div>
            <div className="flex items-center p-2.5">
              <div className="flex items-center w-[150px]">
                <span className="flex items-center w-2.5 h-[11px] mr-2.5 rounded-[2px] bg-[#777777]" />
                <span className="flex items-center font-semibold">Todo</span>
              </div>
              <div className="w-[320px] max-[1400px]:w-[250px]">
                <span className="font-semibold">{truncate("Going to add some style in personal task and as well as in sub tasks", 30)}</span>
              </div>
              <div className="flex items-center gap-2.5 w-[170px] ml-[5px] max-[1400px]:w-[150px]">
                <span>
                  <i className="fa fa-flag text-[#9999]" />
                </span>
                <span className="flex items-center font-semibold">High</span>
              </div>
              <div className="w-[200px] max-[1400px]:w-[150px]">
                <span className="font-semibold">4 Days ago</span>
              </div>
              <div className="w-[180px] max-[1400px]:w-[150px]">
                <span className="font-semibold">2 Days Remaining</span>
              </div>
              <div className="w-[120px] ml-[5px]">
                <span className="font-semibold">{truncate("Going to add some style in dashboard", 15)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeSubTask;
