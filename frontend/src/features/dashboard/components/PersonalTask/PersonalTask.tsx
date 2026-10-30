import React from 'react'

import './PersonalTask.css'

const PersonalTask = () => {
  return (
    <>
      <div className="personal_task_container">
        <h1>Personal Tasks</h1>
        <div className="task_contents">
          <div className="task__header">
            <span className="status">Status</span>
            <span className="task">Task Name</span>
            <span className="priority">Priority</span>
            <span className="created">Created On</span>
            <span className="completed">Completed By</span>
            <span className="action">Action</span>
          </div>
          <div className="task__body">
            <div className="task_row">
              <div className="status">
                <span className="icon_status" />
                <span className="status_text">Todo</span>
              </div>
              <div className="task">
                <span>Going to add some style in dashboard</span>
              </div>
              <div className="priority">
                <span className="icon_priority_low" >
                  <i className='fa fa-flag' />
                </span>
                <span className="priority_task_text">High</span>
              </div>
              <div className="created">
                <span>4 Days ago</span>
              </div>
              <div className="completed">
                <span>2 Days Remaining</span>
              </div>
              <div className="action">
                <span>Edit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PersonalTask