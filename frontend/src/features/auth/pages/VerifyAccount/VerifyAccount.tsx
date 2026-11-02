import React, { useEffect, useRef, useState } from "react";

import * as auth from "features/auth/styles/authClasses";
import image from "shared/assets/images/logo.png";
import { Link, useLocation } from "react-router-dom";
import { FaCheck, FaExclamation } from "react-icons/fa";
import useVerifyAccount from "features/auth/hooks/useVerifyAccount";
import EmailVerifySkeleton from "features/auth/pages/EmailVerify/EmailVerifySkeleton";
import { getApiErrorMessage } from "shared/services/apiError";

// Opened from the link in the registration email: verifies the token and shows the result
const VerifyAccount = () => {
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");
  const [verifyAccount] = useVerifyAccount();
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(token ? "" : "This verification link is not valid.");
  // A token only works once, and StrictMode runs effects twice
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) {
      return;
    }
    requested.current = true;

    verifyAccount(token)
      .then(() => setVerified(true))
      .catch((err) => setError(getApiErrorMessage(err, "We couldn't verify your email. Please try again.")));
  }, [token, verifyAccount]);

  if (!verified && !error) {
    return <EmailVerifySkeleton />;
  }

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
              {verified ? <FaCheck /> : <FaExclamation />}
            </span>
            <h1 className={auth.title}>{verified ? "Email verified" : "Verification failed"}</h1>
            <p className={auth.subtitle}>
              {verified ? "Your email is verified. You can now log in to your account." : error}
            </p>

            <div className={auth.footer}>
              <Link to="/login" className={auth.link}>{verified ? "Go to login" : "Return to login"}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
