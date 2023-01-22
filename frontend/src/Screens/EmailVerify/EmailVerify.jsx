import React from "react";

import "./Verify.css";
import image from "Images/logo.png";
import mail from "Images/mail.png";
import { Link } from "react-router-dom";

const EmailVerify = () => {
  return (
    <div className="verify_container">
      <div className="verify__wrapper">
        <div className="verify__header">
          <img src={image} alt="" />
          <span>ProBucket</span>
        </div>
        <div className="verify__body">
          <div className="verify__body__header">
            <span>Check your inbox to login</span>
          </div>
          <div className="verify__body__content">
            <div className="verify_email_contents">
              <img src={mail} alt="" />
              <p>
                To complete setup and login, click the verification link in the
                email we've sent to{" "}
              </p>
              <span>sahoomanoranjan626@gmail.com</span>
            </div>
            <hr />
            <div className="verify_links">
              <Link to="/login">Resend verfication email</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
