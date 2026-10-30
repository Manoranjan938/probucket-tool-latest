import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Logout.css";
import "features/auth/styles/Auth.css";

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
    <div className="auth auth--single">
      <div className="auth__main">
        <Link to="/" className="auth__brand">
          <img src={image} alt="" />
          <span>ProBucket</span>
        </Link>

        <div className="auth__content">
          <div className="auth__card">
            <h1 className="auth__title">Log out of ProBucket?</h1>
            <p className="auth__subtitle">You're signed in as:</p>

            <div className="auth__user">
              <span className="auth__avatar">{currentUser.fullName?.substring(0, 1)}</span>
              <div className="auth__user__info">
                <p className="auth__user__name">{currentUser.fullName}</p>
                <p className="auth__user__email" title={currentUser.username}>
                  {currentUser.username}
                </p>
              </div>
            </div>

            <button type="button" className="auth__btn auth__btn--primary" onClick={handleClickLogout}>
              <FaSignOutAlt />
              Log out
            </button>
            <Link to="/projects" className="auth__btn auth__btn--ghost">
              Back to my projects
            </Link>

            <div className="auth__footer">
              <Link to="/login">Login to another account</Link>
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
