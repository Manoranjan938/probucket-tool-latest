import React from "react";

import "features/auth/styles/Auth.css";
import image from "shared/assets/images/logo.png";
import { Link } from "react-router-dom";
import { FaEnvelopeOpenText } from "react-icons/fa";

const EmailVerify = () => {
  return (
    <div className="auth auth--single">
      <div className="auth__main">
        <Link to="/" className="auth__brand">
          <img src={image} alt="" />
          <span>ProBucket</span>
        </Link>

        <div className="auth__content">
          <div className="auth__card auth__card--center">
            <span className="auth__status__icon">
              <FaEnvelopeOpenText />
            </span>
            <h1 className="auth__title">Check your inbox</h1>
            <p className="auth__subtitle">
              To complete setup and log in, click the verification link in the
              email we've sent you.
            </p>

            <div className="auth__footer">
              <Link to="/login">Return to login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
