import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as auth from "features/auth/styles/authClasses";

import image from "shared/assets/images/logo.png";
import { FaSignOutAlt } from "react-icons/fa";
import { getApiErrorMessage } from "shared/services/apiError";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { logout, logoutEverywhere } from "features/auth/store/securitySlice";

const Logout = () => {
  const currentUser = useAppSelector((state) => state.security.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleClickLogout = async (endSession: () => Promise<void>) => {
    try {
      await endSession();
      navigate("/login");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not log out. Please try again."));
    }
  };

  return (
    <div className={auth.layoutSingle}>
      <div className={auth.main}>
        <Link to="/" className={auth.brand}>
          <img src={image} alt="" className={auth.brandLogo} />
          <span className={auth.brandName}>ProBucket</span>
        </Link>

        <div className={auth.contentSingle}>
          <div className={auth.card}>
            <h1 className={auth.title}>Log out of ProBucket?</h1>
            <p className={auth.subtitle}>You're signed in as:</p>

            <div className={auth.user}>
              <span className={auth.avatar}>{currentUser.fullName?.substring(0, 1)}</span>
              <div className={auth.userInfo}>
                <p className={auth.userName}>{currentUser.fullName}</p>
                <p className={auth.userEmail} title={currentUser.username}>
                  {currentUser.username}
                </p>
              </div>
            </div>

            <button type="button" className={auth.btnPrimary} onClick={() => handleClickLogout(() => dispatch(logout()))}>
              <FaSignOutAlt />
              Log out
            </button>
            {error && <p className={auth.error}>{error}</p>}
            <button type="button" className={auth.btnGhost} onClick={() => handleClickLogout(() => dispatch(logoutEverywhere()))}>
              Log out on all devices
            </button>
            <Link to="/projects" className={auth.btnGhost}>
              Back to my projects
            </Link>

            <div className={auth.footer}>
              <Link to="/login" className={auth.link}>Login to another account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
