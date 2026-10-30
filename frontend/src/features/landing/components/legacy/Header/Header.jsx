import React from "react";

import "./Header.css";

import logo from "Images/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {

  const [isMobile, setIsMobile] = useState(false);

  const handleClick = () => {
    setIsMobile(!isMobile);
  }

  return (
    <div className="header">
      <div className="header__logo">
        <img src={logo} alt="" />
        <span>ProBucket</span>
      </div>
      <div className="mobile__icon" onClick={handleClick}>
        <i className="fa fa-bars"></i>
      </div>
      <div className={isMobile ? "mobile__header" : "header__contents" }>
        <Link to="#">
          <h5>Why ProBucket</h5>
        </Link>
        <Link to="#">
          <h5>Product Guide</h5>
        </Link>
        <Link to="#">
          <h5>Services</h5>
        </Link>
        <Link to="#">
          <h5>Pricing</h5>
        </Link>
      </div>
      <div className="header__btns">
        <Link to="/login" className="login">
          <h5>Login</h5>
        </Link>
        <button className="free_btn">Get it free</button>
      </div>
    </div>
  );
};

export default Header;
