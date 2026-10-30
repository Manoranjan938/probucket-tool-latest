import React from "react";

import * as auth from "features/auth/styles/authClasses";
import image from "shared/assets/images/logo.png";
import { Link } from "react-router-dom";
import { FaEnvelopeOpenText } from "react-icons/fa";

const EmailVerify = () => {
  return (
    <div className={auth.layoutSingle}>
      <div className={auth.main}>
        <Link to="/" className={auth.brand}>
          <img src={image} alt="" className={auth.brandLogo} />
          <span className={auth.brandName}>ProBucket</span>
        </Link>

        <div className={auth.contentSingle}>
          <div className={`${auth.card} text-center`}>
            <span className={auth.statusIcon}>
              <FaEnvelopeOpenText />
            </span>
            <h1 className={auth.title}>Check your inbox</h1>
            <p className={auth.subtitle}>
              To complete setup and log in, click the verification link in the
              email we've sent you.
            </p>

            <div className={auth.footer}>
              <Link to="/login" className={auth.link}>Return to login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
