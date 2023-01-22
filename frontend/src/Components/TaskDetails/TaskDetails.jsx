import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { AiFillEye, AiOutlineClose } from "react-icons/ai";
import { FiShare2 } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { GiElectric } from "react-icons/gi";
import { GoPrimitiveDot, GoCheck } from "react-icons/go";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { GrAttachment } from "react-icons/gr";
import { VscTypeHierarchySub } from "react-icons/vsc";

import "./TaskDetails.css";
import { Button, Menu, MenuItem } from "@mui/material";
import SubTask from "Components/SubTask/SubTask";
import ExtraDetails from "Components/ExtraTaskDetails/ExtraDetails";
import TaskActivity from "Components/Activity/TaskActivity";
import useUpdateTask from "hooks/useUpdateTask";
import useGetSubTasks from "hooks/useGetSubTasks";
import { connect } from "react-redux";
import { compose } from "redux";
import { setSubtaskList } from "apis/Actions/taskAction";
import NewSubTask from "Components/NewSubTask/NewSubTask";

const TaskDetails = ({ close, task, setSubtasks, allSubtask }) => {
  const [type] = useState("task");
  const [taskStatus, setTaskStatus] = useState({
    title: "TODO",
    type: "inherit",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [details, setDetails] = useState({
    description: "",
    priority: "",
    assignee: "",
  });
  const [updateRequest, setUpdateRequest] = useState({
    taskId: "",
    status: "",
    assignee: "",
    priority: "",
    description: "",
  });
  const [updateTask] = useUpdateTask();
  const [subtasks, getSubtaskList] = useGetSubTasks();
  const [openSubtask, setOpenSubtask] = useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenSubtask = () => {
    setOpenSubtask(!openSubtask);
  }

  useEffect(() => {
    if (task.status === "INPROGRESS") {
      setTaskStatus({ title: task.status, type: "primary" });
    } else if (task.status === "COMPLETED") {
      setTaskStatus({ title: task.status, type: "success" });
    } else if (task.status === "TODO") {
      setTaskStatus({ title: task.status, type: "inherit" });
    }
  }, [task.status]);

  useEffect(() => {
    callGetSubtaskLists();
  }, [task.taskSequence]);

  useEffect(() => {
    setSubtasks(subtasks);
  }, [subtasks]);

  useEffect(() => {
    callUpdateTask();
  }, [updateRequest]);

  const changeStatus = (status) => {
    const st = status;
    if (st === "INPROGRESS") {
      setTaskStatus({ title: st, type: "primary" });
      setUpdateRequest({
        taskId: task.taskSequence,
        status: st,
        assignee: task.assignee,
        priority: task.priority,
        description: task.taskDesc,
      });
      setAnchorEl(null);
    } else if (st === "COMPLETED") {
      setTaskStatus({ title: st, type: "success" });
      setUpdateRequest({
        taskId: task.taskSequence,
        status: st,
        assignee: task.assignee,
        priority: task.priority,
        description: task.taskDesc,
      });
      setAnchorEl(null);
    } else if (st === "TODO") {
      setTaskStatus({ title: st, type: "inherit" });
      setUpdateRequest({
        taskId: task.taskSequence,
        status: st,
        assignee: task.assignee,
        priority: task.priority,
        description: task.taskDesc,
      });
      setAnchorEl(null);
    }
  };

  const callUpdateTask = async () => {
    try {
      const resp = await updateTask(updateRequest);

      if (resp.status === 200) {
        console.log("Updated successfully");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const callGetSubtaskLists = async () => {
    try {
      await getSubtaskList(task.taskSequence);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="task_details_container">
        <div className="task_details_header">
          <div className="identifier">
            <div className="type_icon">
              {type === "epic" && (
                <span className="icon_epic">
                  <GiElectric />
                </span>
              )}
              {type === "bug" && (
                <span className="icon_bug">
                  <GoPrimitiveDot />
                </span>
              )}
              {type === "task" && (
                <span className="icon_task">
                  <GoCheck />
                </span>
              )}
            </div>
            <Link to="#" className="unique_ids">
              {task.taskSequence}
            </Link>
          </div>
          <div className="extra_icons">
            <AiFillEye />
            <FiShare2 />
            <BsThreeDots />
            <AiOutlineClose onClick={close} />
          </div>
        </div>
        <div className="task_details_body">
          <div className="task_operatives">
            <div className="task_title">
              <h1>{task.taskName}</h1>
            </div>
            <div className="tasks_links">
              <Button variant="contained" color="inherit">
                <GrAttachment /> &nbsp; Attach
              </Button>
              <Button
                variant="contained"
                color="inherit"
                onClick={handleOpenSubtask}
              >
                <VscTypeHierarchySub /> &nbsp; Create Subtask
              </Button>
            </div>
            <div className="description">
              <h5>Description</h5>
              <div className="text-field">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Add a description"
                  onChange={(e) =>
                    setDetails({ ...details, description: e.target.value })
                  }
                />
              </div>
              <div className="desc_btns">
                <Button variant="contained">Save</Button>
                <Button variant="contained" color="inherit">
                  Cancel
                </Button>
              </div>
            </div>
            <div className="subtasks_list">
              {allSubtask.length > 0 && <SubTask subtask={allSubtask} />}
            </div>
            <div className="activities">
              <TaskActivity />
            </div>
          </div>
          <div className="task_extras">
            <div className="status_btn">
              <Button
                variant="contained"
                color={taskStatus.type}
                onClick={handleClick}
              >
                {taskStatus.title}
                <span>
                  {open ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                </span>
              </Button>
            </div>
            <ExtraDetails />
          </div>
        </div>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => changeStatus("TODO")}>ToDo</MenuItem>
        <MenuItem onClick={() => changeStatus("INPROGRESS")}>
          InProgress
        </MenuItem>
        <MenuItem onClick={() => changeStatus("COMPLETED")}>Completed</MenuItem>
      </Menu>
      {openSubtask && (
        <NewSubTask open={openSubtask} setOpen={setOpenSubtask} />
      )}
    </>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    setSubtasks: (data) => dispatch(setSubtaskList(data)),
  };
}

const mapStateToProps = (state) => ({
  task: state.tasks.selectedTask,
  allSubtask: state.tasks.allSubtasks
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(TaskDetails);
