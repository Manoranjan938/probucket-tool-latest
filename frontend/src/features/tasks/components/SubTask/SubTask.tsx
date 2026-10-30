import React, { useState } from "react";


import { RiArrowDropDownLine } from "react-icons/ri";
import { BsPlus } from "react-icons/bs";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { GoPrimitiveDot, GoCheck } from "react-icons/go";
import { BiCopyAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import type { Subtask } from "features/tasks/types";

const SubTask = ({ subtask }: { subtask: Subtask[] }) => {
  const [subtaskType] = useState("subtask");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openStatusMenu, setOpenStatusMenu] = useState(false);
  const [openAssigneeMenu, setOpenAssigneeMenu] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusMenu = () => {
    setOpenStatusMenu(!openStatusMenu);
  };

  const handleAssigneeMenu = () => {
    setOpenAssigneeMenu(!openAssigneeMenu);
  };

  const truncate = (string: string, n: number) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  return (
    <>
      <div className="w-auto mt-[5px]">
        <div className="flex justify-between items-center my-2.5">
          <h5 className="text-[15px] text-[#909090]">Subtasks</h5>
          <div className="flex items-center gap-2.5 text-[16px] font-semibold">
            <div className="flex items-center gap-[5px] py-[5px] px-2.5 rounded-[2px] text-[14px] font-semibold hover:cursor-pointer hover:bg-[#e5e5e5]" onClick={handleClick}>
              <span>Order by</span>
              <RiArrowDropDownLine />
            </div>
            <Tooltip title="Add new Subtask">
              <IconButton>
                <BsPlus />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div>
          {subtask.map((item, index) => (
            <div className="flex justify-between items-center w-auto mb-2.5 py-3 px-2.5 border border-[#e5e5e5] rounded-[3px] shadow-[1px_1px_4px_#0006] cursor-pointer" key={index}>
              <div className="flex items-center gap-2.5 w-full">
                <div>
                  {subtaskType === "bug" && (
                    <span>
                      <GoPrimitiveDot />
                    </span>
                  )}
                  {subtaskType === "task" && (
                    <span className="p-px rounded-[2px] bg-[#2cceb8] text-[14px] text-white">
                      <GoCheck />
                    </span>
                  )}
                  {subtaskType === "subtask" && (
                    <span className="p-0.5 rounded-[3px] bg-[#4acef9] text-[13px] text-white">
                      <BiCopyAlt />
                    </span>
                  )}
                </div>
                <div className="ml-2.5">
                  <Link to="#">
                    <span className="uppercase text-[14px] font-bold text-[#4acef9]">{item.taskSequence}</span>
                  </Link>
                </div>
                <div className="w-[70%] ml-2.5">
                  <p>{truncate(item.taskName, 55)}</p>
                </div>
              </div>
              <div className="flex items-center gap-[5px]">
                <div>
                  <Tooltip title="Priority: Low">
                    <IconButton>
                      <span className="text-[16px]">
                        <i className="fa fa-flag" />
                      </span>
                    </IconButton>
                  </Tooltip>
                  {/* <span className="icon_priority_low">
                  <i className="fa fa-flag" />
                </span> */}
                </div>
                <div onClick={handleAssigneeMenu}>
                  <Tooltip title="Assignee: Manoranjan Sahoo">
                    <IconButton>
                      <span className="text-[16px]">
                        <i className="fa fa-user" />
                      </span>
                    </IconButton>
                  </Tooltip>
                </div>
                <div onClick={handleStatusMenu}>
                  <div className="flex items-center py-0.5 px-[5px] rounded-[3px] bg-[#e5e5e5] uppercase font-bold cursor-pointer">
                    <span className="text-[13px]">{item.status}</span>
                    <RiArrowDropDownLine />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Created</MenuItem>
        <MenuItem onClick={handleClose}>Key</MenuItem>
        <MenuItem onClick={handleClose}>Priority</MenuItem>
        <MenuItem onClick={handleClose}>Status</MenuItem>
        <MenuItem onClick={handleClose}>Assignee</MenuItem>
      </Menu>
    </>
  );
};

export default SubTask;
