import NewTask from "Components/NewTask/NewTask";
import WorkTask from "Components/WorkTask/WorkTask";
import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import "./ProjectWorks.css";

const ProjectWorks = ({ myTasks }) => {
  const [showNewModal, setShowNewModal] = useState(false);

  const handleNewModal = () => {
    setShowNewModal(true);
  };

  const proTasks = myTasks.map((task, index) => (
    <WorkTask key={index} taskDetails={task} />
  ));

  let todoItems = [];
  let inProgressItems = [];
  let completedItems = [];

  for (let i = 0; i < proTasks.length; i++) {
    //console.log(proTasks[i].props.taskDetails.status)
    if (proTasks[i].props.taskDetails.status === "TODO") {
      todoItems.push(proTasks[i]);
    }

    if (proTasks[i].props.taskDetails.status === "INPROGRESS") {
      inProgressItems.push(proTasks[i]);
    }

    if (proTasks[i].props.taskDetails.status === "COMPLETED") {
      completedItems.push(proTasks[i]);
    }
  }

  return (
    <>
      <div className="project_works_container">
        <div className="projects_task_header_row">
          <div className="project_status_card todo">
            <div className="details">
              <span>To Do</span>
              <span className="counter">{todoItems.length}</span>
            </div>
            <div className="icons">
              <i className="fa fa-ellipsis-h" />
              <i className="fa fa-plus" onClick={handleNewModal} />
            </div>
          </div>
          <div className="project_status_card inprogress">
            <div className="details">
              <span>In Progress</span>
              <span className="counter">{inProgressItems.length}</span>
            </div>
            <div className="icons">
              <i className="fa fa-ellipsis-h" />
              {/* <i className="fa fa-plus" onClick={handleNewModal} /> */}
            </div>
          </div>
          <div className="project_status_card project_completed">
            <div className="details">
              <span>Completed</span>
              <span className="counter">{completedItems.length}</span>
            </div>
            <div className="icons">
              <i className="fa fa-ellipsis-h" />
            </div>
          </div>
        </div>

        <div className="project_task_body_row">
          <div className="todo_task">
            {todoItems}
            {/* <WorkTask /> */}
          </div>
          <div className="inprogress_task">
            {inProgressItems}
            {/* <WorkTask /> */}
          </div>
          <div className="completed_task">
            {completedItems}
            {/* <WorkTask /> */}
          </div>
        </div>
      </div>

      {showNewModal && (
        <NewTask open={showNewModal} setOpen={setShowNewModal} />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  myTasks: state.tasks.allTask,
});

const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(ProjectWorks);
