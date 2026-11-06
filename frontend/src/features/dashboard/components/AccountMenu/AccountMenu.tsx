import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Divider, Menu, MenuItem, Tooltip } from "@mui/material";
import { FiChevronUp, FiFolder, FiLogOut, FiUser } from "react-icons/fi";

import * as dashboard from "features/dashboard/styles/dashboardClasses";
import { useAppSelector } from "app/hooks";


type Props = {
  /** Only the avatar shows, with the user's name as a tooltip */
  collapsed: boolean;
};

// Signed-in user at the bottom of the sidebar, with Profile, Projects and Log out
const AccountMenu = ({ collapsed }: Props) => {
  const currentUser = useAppSelector((state) => state.security.user);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={collapsed && !open ? currentUser.fullName ?? "" : ""} placement="right">
        <button
          type="button"
          className={collapsed ? dashboard.menuTriggerCollapsed : dashboard.menuTrigger}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label={collapsed ? `Account: ${currentUser.fullName ?? ""}` : undefined}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? "account-menu" : undefined}
        >
          <span className={dashboard.userAvatar} aria-hidden="true">
            {currentUser.fullName?.substring(0, 1)}
          </span>
          {collapsed ? null : (
            <>
              <span className={dashboard.triggerText}>
                <span className={`block ${dashboard.triggerTitle}`}>{currentUser.fullName}</span>
                <span className={`block ${dashboard.userEmail}`}>{currentUser.username}</span>
              </span>
              <FiChevronUp className={dashboard.triggerChevron} aria-hidden="true" />
            </>
          )}
        </button>
      </Tooltip>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{
          className: `${dashboard.menuPaper} -mt-1!`,
          sx: { width: collapsed ? dashboard.menuWidthCollapsed : anchorEl?.offsetWidth },
        }}
      >
        <MenuItem component={Link} to="/profile" onClick={handleClose} className={dashboard.menuItem}>
          <FiUser className={dashboard.menuItemIcon} aria-hidden="true" />
          Profile
        </MenuItem>
        <MenuItem component={Link} to="/projects" onClick={handleClose} className={dashboard.menuItem}>
          <FiFolder className={dashboard.menuItemIcon} aria-hidden="true" />
          All projects
        </MenuItem>
        <Divider />
        <MenuItem component={Link} to="/logout" onClick={handleClose} className={dashboard.menuItem}>
          <FiLogOut className={dashboard.menuItemIcon} aria-hidden="true" />
          Log out
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;
