import { Modal } from "@mui/material";
import { getSingleTask, removeSelectedTask } from "features/tasks/store/taskAction";
import TaskDetails from "features/tasks/components/TaskDetails/TaskDetails";
import useGetTaskDetails from "features/tasks/hooks/useGetTaskDetails";
import React, { useState } from "react";
import { useEffect } from "react";

import { FiUserPlus } from "react-icons/fi";
import { connect, type ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";
import { compose } from "redux";
import type { AppDispatch } from "app/store";
import type { TaskDetails as TaskDetailsData, TaskListItem } from "features/tasks/types";

import "./WorkTask.css";

const WorkTask = ({ taskDetails, setTask, removeTask }: { taskDetails: TaskListItem } & Props) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [task, getTaskDetails] = useGetTaskDetails();

  const handleTaskModal = (sequence: string) => {
    setShowTaskModal(true);
    callGetTask(sequence);
  };

  const handleClose = () => {
    setShowTaskModal(false);
    // TODO(ts-migration): removeTask is the thunk's inner function (see mapDispatchToProps), so calling it
    // without a dispatch throws "dispatch is not a function" whenever the task modal is closed
    // @ts-expect-error removeTask expects a dispatch argument
    removeTask();
  };

  const callGetTask = async (sequence: string) => {
    try {
      await getTaskDetails(sequence);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTask(task);
  }, [task]);

  return (
    <>
      <div className="task_container">
        <div
          className="task_card"
          onClick={() => handleTaskModal(taskDetails.taskSequence)}
        >
          <div className="task">
            <div className="contents">
              <span className="task_names">{taskDetails.taskName}</span>
              <span className="asignee_icon">
                <FiUserPlus />
              </span>
            </div>
            <div className="subtask"></div>
            <div className="extras">
              <div className="more_icons">
                {/* <i className="fa fa-calendar-check-o" /> */}
                {taskDetails.priority === "LOW" && (
                  <span className="priority_low">
                    <i className="fa fa-flag" />
                  </span>
                )}
                {taskDetails.priority === "MEDIUM" && (
                  <span className="priority_med">
                    <i className="fa fa-flag" />
                  </span>
                )}
                {taskDetails.priority === "HIGH" && (
                  <span className="priority_high">
                    <i className="fa fa-flag" />
                  </span>
                )}
                {taskDetails.priority === "" && (
                  <span className="priority_none">
                    <i className="fa fa-flag-o" />
                  </span>
                )}
              </div>
              {/* <div className="edit_options">
                <i className="fa fa-check" />
                <i className="fa fa-ellipsis-h" />
              </div> */}
              <div className="task_id">
                <Link to="#">{taskDetails.taskSequence}</Link>
              </div>
            </div>
          </div>
        </div>

        <Modal
          open={showTaskModal}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <TaskDetails close={handleClose} />
        </Modal>
      </div>
    </>
  );
};

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    setTask: (data: Partial<TaskDetailsData>) => dispatch(getSingleTask(data)),
    // TODO(ts-migration): dispatches the action creator itself instead of removeSelectedTask() – see handleClose
    removeTask: dispatch(removeSelectedTask),
  };
}

const withConnect = connect(null, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(WorkTask);
