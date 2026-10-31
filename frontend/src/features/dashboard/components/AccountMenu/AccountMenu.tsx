import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import { Divider, Menu, MenuItem } from "@mui/material";
import { FiChevronUp, FiFolder, FiLogOut, FiUser } from "react-icons/fi";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

import type { RootState } from "app/store";

// Signed-in user at the bottom of the sidebar, with Profile, Projects and Log out
const AccountMenu = ({ currentUser }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <button
        type="button"
        className={dashboard.menuTrigger}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? "account-menu" : undefined}
      >
        <span className={dashboard.userAvatar} aria-hidden="true">
          {currentUser.fullName?.substring(0, 1)}
        </span>
        <span className={dashboard.triggerText}>
          <span className={`block ${dashboard.triggerTitle}`}>{currentUser.fullName}</span>
          <span className={`block ${dashboard.userEmail}`}>{currentUser.username}</span>
        </span>
        <FiChevronUp className={dashboard.triggerChevron} aria-hidden="true" />
      </button>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{ className: `${dashboard.menuPaper} -mt-1!`, sx: { width: anchorEl?.offsetWidth } }}
      >
        <MenuItem component={Link} to="/people" onClick={handleClose} className={dashboard.menuItem}>
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

const mapStateToProps = (state: RootState) => ({
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(AccountMenu);
