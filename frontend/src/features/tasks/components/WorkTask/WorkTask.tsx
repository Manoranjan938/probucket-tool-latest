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
      <div className="w-auto mt-5">
        <div
          className="w-auto mb-5 py-[5px] px-[15px] rounded-[4px] shadow-[1px_1px_4px_#00000080] cursor-move hover:bg-[#efefef]"
          onClick={() => handleTaskModal(taskDetails.taskSequence)}
        >
          <div>
            <div className="flex justify-between">
              <span>{taskDetails.taskName}</span>
              <span className="flex justify-center items-center w-[18px] h-[18px] m-0 p-[5px] border border-dashed border-[#888] rounded-[50%] cursor-pointer">
                <FiUserPlus />
              </span>
            </div>
            <div></div>
            <div className="flex justify-between items-center mt-2.5">
              <div className="flex items-center gap-2.5">
                {/* <i className="fa fa-calendar-check-o" /> */}
                {taskDetails.priority === "LOW" && (
                  <span>
                    <i className="fa fa-flag text-[#888]" />
                  </span>
                )}
                {taskDetails.priority === "MEDIUM" && (
                  <span>
                    <i className="fa fa-flag text-[#fbc536]" />
                  </span>
                )}
                {taskDetails.priority === "HIGH" && (
                  <span>
                    <i className="fa fa-flag text-[#ff8367]" />
                  </span>
                )}
                {taskDetails.priority === "" && (
                  <span>
                    <i className="fa fa-flag-o text-[#9999]" />
                  </span>
                )}
              </div>
              {/* <div className="flex items-center gap-2.5">
                <i className="fa fa-check" />
                <i className="fa fa-ellipsis-h" />
              </div> */}
              <div>
                <Link to="#" className="text-[#827ed8]">{taskDetails.taskSequence}</Link>
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
