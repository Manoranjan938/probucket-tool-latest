import Comments from "features/comments/components/Comments/Comments";
import TaskHistory from "features/tasks/components/TaskHistory/TaskHistory";
import React, { useState } from "react";

import * as task from "features/tasks/styles/taskClasses";

const TaskActivity = () => {
  const [showTab, setShowTab] = useState(1);

  return (
    <section className={task.section} aria-labelledby="activity-title">
      <div className={task.sectionHeader}>
        <h3 id="activity-title" className={task.sectionTitle}>Activity</h3>
        <div className={task.tabs} role="tablist" aria-label="Show">
          <button
            type="button"
            role="tab"
            aria-selected={showTab === 1}
            className={showTab === 1 ? task.tabActive : task.tab}
            onClick={() => setShowTab(1)}
          >
            Comments
          </button>
          {/* <button
            type="button"
            role="tab"
            aria-selected={showTab === 2}
            className={showTab === 2 ? task.tabActive : task.tab}
            onClick={() => setShowTab(2)}
          >
            History
          </button> */}
        </div>
      </div>
      <div>
        {showTab === 1 && <Comments />}
        {showTab === 2 && <TaskHistory />}
      </div>
    </section>
  );
};

export default TaskActivity;
