import Comments from "Components/Comments/Comments";
import TaskHistory from "Components/TaskHistory/TaskHistory";
import React, { useState } from "react";

import "./TaskActivity.css";

const TaskActivity = () => {
  const [showTab, setShowTab] = useState(1);

  const handleTab = (tab) => {
    setShowTab(tab);
  };

  return (
    <>
      <div className="task_activity_container">
        <h5>Activity</h5>
        <div className="activity_header">
          <span>Show:</span>
          <div
            className={showTab === 1 ? "tabs activity_active_tab" : "tabs"}
            onClick={() => handleTab(1)}
          >
            <span>Comments</span>
          </div>
          {/* <div
            className={showTab === 2 ? "tabs activity_active_tab" : "tabs"}
            onClick={() => handleTab(2)}
          >
            <span>History</span>
          </div> */}
        </div>
        <div className="activity_body">
          {showTab === 1 && <Comments />}
          {showTab === 2 && <TaskHistory />}
        </div>
      </div>
    </>
  );
};

export default TaskActivity;
