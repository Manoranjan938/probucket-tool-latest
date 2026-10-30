import React from "react";
import { Link } from "react-router-dom";

import * as landing from "features/landing/styles/landingClasses";

import logo from "shared/assets/images/logo.png";
import { navLinks } from "features/landing/data";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-brand-border">
      <div className={`${landing.container} flex items-center justify-between gap-6 max-[768px]:flex-col max-[768px]:text-center`}>
        <Link to="/" className={landing.brand}>
          <img src={logo} alt="" className="w-7 h-7" />
          <span className={`${landing.brandName} text-[18px]`}>ProBucket</span>
        </Link>
        <nav className="flex gap-6">
          {navLinks.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-[14px] text-brand-text no-underline hover:text-brand-strong"
            >
              {item.title}
            </a>
          ))}
        </nav>
        <p className="text-[14px] text-brand-muted">© {new Date().getFullYear()} ProBucket</p>
      </div>
    </footer>
  );
};

export default Footer;
