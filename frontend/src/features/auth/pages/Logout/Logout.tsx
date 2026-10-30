import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Logout.css";

import image from "shared/assets/images/logo.png";
import user from "shared/assets/images/user.png";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import { logout } from "features/auth/store/securityActions";
import type { AppDispatch, RootState } from "app/store";

const Logout = ({ logout, currentUser }: Props) => {
  const navigate = useNavigate();

  const truncate = (string: string | undefined, n: number) => {
    return string && string.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  const handleClickLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="logout_container">
      <div className="logout__wrapper">
        <div className="logout__header">
          <img src={image} alt="" />
          <span>ProBucket</span>
        </div>
        <div className="logout__body">
          <div className="logout__body__header">
            <span>Login to continue to:</span>
            <h5>Probucket</h5>
          </div>
          <div className="logout__body__content">
            <div className="logout__user__details">
              <img src={user} alt="" />
              <div className="logout__user">
                <h4>{currentUser.fullName}</h4>
                <p>{truncate(currentUser.username, 27)}</p>
              </div>
            </div>
            <button className="logout__btn" onClick={handleClickLogout}>
              Log out
            </button>
            <hr />
            <div className="logout__links">
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
