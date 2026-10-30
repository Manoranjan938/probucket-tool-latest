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

import { Button, Menu, MenuItem, type ButtonProps } from "@mui/material";
import SubTask from "features/tasks/components/SubTask/SubTask";
import ExtraDetails from "features/tasks/components/ExtraDetails/ExtraDetails";
import TaskActivity from "features/tasks/components/TaskActivity/TaskActivity";
import useUpdateTask from "features/tasks/hooks/useUpdateTask";
import useGetSubTasks from "features/tasks/hooks/useGetSubTasks";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import { setSubtaskList } from "features/tasks/store/taskAction";
import NewSubTask from "features/tasks/components/NewSubTask/NewSubTask";
import type { AppDispatch, RootState } from "app/store";
import type { Subtask, UpdateTaskRequest } from "features/tasks/types";

const TaskDetails = ({ close, task, setSubtasks, allSubtask }: { close: () => void } & Props) => {
  const [type] = useState("task");
  const [taskStatus, setTaskStatus] = useState<{ title: string; type: ButtonProps["color"] }>({
    title: "TODO",
    type: "inherit",
  });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [details, setDetails] = useState({
    description: "",
    priority: "",
    assignee: "",
  });
  const [updateRequest, setUpdateRequest] = useState<UpdateTaskRequest>({
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
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
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

  const changeStatus = (status: string) => {
    const st = status;
    if (st === "INPROGRESS") {
      setTaskStatus({ title: st, type: "primary" });
      setUpdateRequest({
        taskId: task.taskSequence!,
        status: st,
        assignee: task.assignee!,
        priority: task.priority!,
        description: task.taskDesc!,
      });
      setAnchorEl(null);
    } else if (st === "COMPLETED") {
      setTaskStatus({ title: st, type: "success" });
      setUpdateRequest({
        taskId: task.taskSequence!,
        status: st,
        assignee: task.assignee!,
        priority: task.priority!,
        description: task.taskDesc!,
      });
      setAnchorEl(null);
    } else if (st === "TODO") {
      setTaskStatus({ title: st, type: "inherit" });
      setUpdateRequest({
        taskId: task.taskSequence!,
        status: st,
        assignee: task.assignee!,
        priority: task.priority!,
        description: task.taskDesc!,
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
      <div className="w-[80%] h-[80%] my-[3%] mx-auto py-6 px-8 rounded-xl bg-white">
        <div className="flex justify-between">
          <div className="flex items-center gap-[5px]">
            <div>
              {type === "epic" && (
                <span>
                  <GiElectric />
                </span>
              )}
              {type === "bug" && (
                <span>
                  <GoPrimitiveDot />
                </span>
              )}
              {type === "task" && (
                <span className="p-px rounded-[2px] bg-[#2cceb8] text-[14px] text-white">
                  <GoCheck />
                </span>
              )}
            </div>
            <Link to="#" className="text-[15px]">
              {task.taskSequence}
            </Link>
          </div>
          <div className="flex gap-[30px] text-[26px] cursor-pointer">
            <AiFillEye />
            <FiShare2 />
            <BsThreeDots />
            <AiOutlineClose onClick={close} />
          </div>
        </div>
        <div className="grid grid-cols-[2fr_1fr] gap-10 mt-5">
          <div className="h-[550px] pr-2.5 overflow-y-auto max-[1500px]:h-[450px]">
            <div>
              <h1 className="font-medium">{task.taskName}</h1>
            </div>
            <div className="flex gap-2.5 mt-2.5">
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
            <div className="w-auto mt-5">
              <h5 className="font-medium">Description</h5>
              <div className="mt-[5px] mb-2.5 py-4 px-8 border border-[#b7acac] rounded-[3px]">
                <input
                  className="w-full bg-transparent border-none outline-none text-[18px]"
                  type="text"
                  name=""
                  id=""
                  placeholder="Add a description"
                  onChange={(e) =>
                    setDetails({ ...details, description: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2.5">
                <Button variant="contained">Save</Button>
                <Button variant="contained" color="inherit">
                  Cancel
                </Button>
              </div>
            </div>
            <div>
              {allSubtask.length > 0 && <SubTask subtask={allSubtask} />}
            </div>
            <div className="mt-[30px]">
              <TaskActivity />
            </div>
          </div>
          <div>
            <div className="[&>button]:flex [&>button]:gap-2.5 [&>button]:items-center!">
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

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    setSubtasks: (data: Subtask[]) => dispatch(setSubtaskList(data)),
  };
}

const mapStateToProps = (state: RootState) => ({
  task: state.tasks.selectedTask,
  allSubtask: state.tasks.allSubtasks
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(TaskDetails);
