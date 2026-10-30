import React, { useState } from "react";
import "./DashboardHeader.css";

import image from "shared/assets/images/logo.png";
import user from 'shared/assets/images/user.png'

import { FaSearch } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import type { RootState } from "app/store";

const DashboardHeader = ({currentUser}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const nav = useNavigate();
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotification = () => {
    nav("/dashboard/notifications");
  }
  return (
    <div className="dashboard__header">
      <div className="dashboard__header__logo">
        <img src={image} alt="" />
        <span>ProBucket</span>
      </div>
      <div className="header__icons">
        <div className="search__field">
          <FaSearch className="search" />
          <input type="text" placeholder="Search" />
        </div>
        {/* <Tooltip title="Setting">
          <IconButton>
            <MdSettings className="header__icon" />
          </IconButton>
        </Tooltip> */}
        <Tooltip title="Notification">
          <IconButton onClick={handleNotification}>
            <MdNotifications className="header__icon" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Profile">
          <IconButton
            onClick={handleClick}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <img src={user} alt="" className="user__img" />
          </IconButton>
        </Tooltip>
      </div>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Avatar>{currentUser.fullName!.substring(0,1)}</Avatar>
          </ListItemIcon>
          <div className="profile">
            <h5>{currentUser.fullName} </h5>
            <p>{currentUser.username}</p>
          </div>
        </MenuItem>
        {/* <MenuItem onClick={handleClose}>
          <div className="menu__items">Switch account</div>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <div className="menu__items">
            <Link to="/manage-account/profile-setting">Manage account</Link>
          </div>
        </MenuItem> */}
        <Divider />
        <MenuItem onClick={handleClose}>
          <div className="menu__items">
            <Link to="/people">Profile</Link>
          </div>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <div className="menu__items">
            <Link to="/projects">Projects</Link>
          </div>
        </MenuItem>
        {/* <MenuItem onClick={handleClose}>
          <div className="menu__items">
            <Link to="/account/setting">Personal Setting</Link>
          </div>
        </MenuItem> */}
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <Link to="/logout">Logout</Link>
        </MenuItem>
      </Menu>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(DashboardHeader);
