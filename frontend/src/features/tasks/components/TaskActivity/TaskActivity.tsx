import Comments from "features/comments/components/Comments/Comments";
import TaskHistory from "features/tasks/components/TaskHistory/TaskHistory";
import React, { useState } from "react";

const tabBase = "py-[3px] px-2.5 rounded-[3px] cursor-pointer";
const tabClass = `${tabBase} bg-[#efefef] text-[#777]`;
const activeTabClass = `${tabBase} bg-[#585151] text-white!`;

const TaskActivity = () => {
  const [showTab, setShowTab] = useState(1);

  const handleTab = (tab: number) => {
    setShowTab(tab);
  };

  return (
    <>
      <div>
        <h5>Activity</h5>
        <div className="flex items-center gap-2.5 mt-2.5">
          <span>Show:</span>
          <div
            className={showTab === 1 ? activeTabClass : tabClass}
            onClick={() => handleTab(1)}
          >
            <span className="font-semibold">Comments</span>
          </div>
          {/* <div
            className={showTab === 2 ? activeTabClass : tabClass}
            onClick={() => handleTab(2)}
          >
            <span className="font-semibold">History</span>
          </div> */}
        </div>
        <div>
          {showTab === 1 && <Comments />}
          {showTab === 2 && <TaskHistory />}
        </div>
      </div>
    </>
  );
};

export default TaskActivity;
