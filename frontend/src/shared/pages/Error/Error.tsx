import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import "./Error.css";

import logo from "shared/assets/images/logo.png";
import image from "shared/assets/images/error-page.png";

// Shown for any URL that no route matches
const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="error">
      <header className="error__header">
        <Link to="/" className="error__brand">
          <img src={logo} alt="" />
          <span>ProBucket</span>
        </Link>
      </header>

      <main className="error__main">
        <img className="error__image" src={image} alt="" />
        <span className="error__eyebrow">404 error</span>
        <h1 className="error__title">Page not found</h1>
        <p className="error__text">
          Sorry, we couldn't find the page you're looking for. It may have been
          moved, renamed or never existed.
        </p>
        <div className="error__actions">
          <Link to="/" className="error__btn error__btn--primary">
            Go to home
          </Link>
          <button type="button" className="error__btn error__btn--ghost" onClick={() => navigate(-1)}>
            <FaArrowLeft />
            Go back
          </button>
        </div>
      </main>
    </div>
  );
};

export default Error;
