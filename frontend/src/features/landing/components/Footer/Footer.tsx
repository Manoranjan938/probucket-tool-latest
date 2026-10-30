import React from "react";
import { Link } from "react-router-dom";

import "./Footer.css";

import logo from "shared/assets/images/logo.png";
import { navLinks } from "features/landing/data";

const Footer = () => {
  return (
    <footer className="landing__footer">
      <div className="landing__container landing__footer__inner">
        <Link to="/" className="landing__brand">
          <img src={logo} alt="" />
          <span>ProBucket</span>
        </Link>
        <nav className="landing__footer__links">
          {navLinks.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.title}
            </a>
          ))}
        </nav>
        <p>© {new Date().getFullYear()} ProBucket</p>
      </div>
    </footer>
  );
};

export default Footer;
