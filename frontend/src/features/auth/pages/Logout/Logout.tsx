import React from "react";
import { Link, useNavigate } from "react-router-dom";

import * as auth from "features/auth/styles/authClasses";

import image from "shared/assets/images/logo.png";
import { FaSignOutAlt } from "react-icons/fa";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import { logout } from "features/auth/store/securityActions";
import type { AppDispatch, RootState } from "app/store";

const Logout = ({ logout, currentUser }: Props) => {
  const navigate = useNavigate();

  const handleClickLogout = () => {
    logout();
    navigate("/login");
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

            <button type="button" className={auth.btnPrimary} onClick={handleClickLogout}>
              <FaSignOutAlt />
              Log out
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

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    logout: () => dispatch(logout()),
  };
}

const mapStateToProps = (state: RootState) => ({
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(Logout);
