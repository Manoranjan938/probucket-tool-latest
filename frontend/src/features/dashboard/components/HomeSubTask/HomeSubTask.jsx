import React from "react";

import './HomeSubTask.css'

const HomeSubTask = () => {

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  return (
    <>
      <div className="subtask__container">
        <h1>Subtask Component</h1>
        <div className="subtask__contents">
          <div className="sub_task_header">
            <span className="status">Status</span>
            <span className="subtask">SubTask Name</span>
            <span className="priority">Priority</span>
            <span className="created">Created On</span>
            <span className="completed">Completed By</span>
            <span className="parent">Parent Task</span>
          </div>
          <div className="sub_task_body">
            <div className="task_row">
              <div className="status">
                <span className="icon_status" />
                <span className="status_text">Todo</span>
              </div>
              <div className="subtask">
                <span>{truncate("Going to add some style in personal task and as well as in sub tasks", 30)}</span>
              </div>
              <div className="priority">
                <span className="icon_priority_low">
                  <i className="fa fa-flag" />
                </span>
                <span className="priority_task_text">High</span>
              </div>
              <div className="created">
                <span>4 Days ago</span>
              </div>
              <div className="completed">
                <span>2 Days Remaining</span>
              </div>
              <div className="parent">
                <span>{truncate("Going to add some style in dashboard", 15)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeSubTask;
