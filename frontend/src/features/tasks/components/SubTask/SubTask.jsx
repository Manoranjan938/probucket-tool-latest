import React, { useState } from "react";

import "./SubTask.css";

import { RiArrowDropDownLine } from "react-icons/ri";
import { BsPlus } from "react-icons/bs";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { GoPrimitiveDot, GoCheck } from "react-icons/go";
import { BiCopyAlt } from "react-icons/bi";
import { Link } from "react-router-dom";

const SubTask = ({ subtask }) => {
  const [subtaskType] = useState("subtask");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openStatusMenu, setOpenStatusMenu] = useState(false);
  const [openAssigneeMenu, setOpenAssigneeMenu] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
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

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  return (
    <>
      <div className="subtask_container">
        <div className="subtask_header">
          <h5>Subtasks</h5>
          <div className="subtask_icons">
            <div className="order_by_btn" onClick={handleClick}>
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
        <div className="subtask_body">
          {subtask.map((item, index) => (
            <div className="subtask_card" key={index}>
              <div className="details">
                <div className="subtask_type_icon">
                  {subtaskType === "bug" && (
                    <span className="icon_bug">
                      <GoPrimitiveDot />
                    </span>
                  )}
                  {subtaskType === "task" && (
                    <span className="icon_task">
                      <GoCheck />
                    </span>
                  )}
                  {subtaskType === "subtask" && (
                    <span className="icon_subtask">
                      <BiCopyAlt />
                    </span>
                  )}
                </div>
                <div className="subtask_unique_id">
                  <Link to="#">
                    <span>{item.taskSequence}</span>
                  </Link>
                </div>
                <div className="subtask_title">
                  <p>{truncate(item.taskName, 55)}</p>
                </div>
              </div>
              <div className="subtask_extras">
                <div className="subtask_priority">
                  <Tooltip title="Priority: Low">
                    <IconButton>
                      <span className="subtask_priority_icon">
                        <i className="fa fa-flag" />
                      </span>
                    </IconButton>
                  </Tooltip>
                  {/* <span className="icon_priority_low">
                  <i className="fa fa-flag" />
                </span> */}
                </div>
                <div className="subtask_asignee" onClick={handleAssigneeMenu}>
                  <Tooltip title="Assignee: Manoranjan Sahoo">
                    <IconButton>
                      <span className="subtask_priority_icon">
                        <i className="fa fa-user" />
                      </span>
                    </IconButton>
                  </Tooltip>
                </div>
                <div className="subtask_status" onClick={handleStatusMenu}>
                  <div className="status_name_icon">
                    <span>{item.status}</span>
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
