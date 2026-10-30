import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

import "./LandingNav.css";

import logo from "shared/assets/images/logo.png";
import { navLinks } from "features/landing/data";

const LandingNav = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="landing__nav">
      <div className="landing__container landing__nav__inner">
        <Link to="/" className="landing__brand">
          <img src={logo} alt="" />
          <span>ProBucket</span>
        </Link>

        <button
          type="button"
          className="landing__nav__toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div
          className={
            menuOpen ? "landing__nav__menu landing__nav__menu--open" : "landing__nav__menu"
          }
        >
          <nav className="landing__nav__links">
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.title}
              </a>
            ))}
          </nav>

          <div className="landing__nav__actions">
            {isLoggedIn ? (
              <Link to="/projects" className="landing__btn landing__btn--primary landing__btn--small">
                Go to my projects
              </Link>
            ) : (
              <>
                <Link to="/login" className="landing__nav__login">
                  Log in
                </Link>
                <Link to="/signup" className="landing__btn landing__btn--primary landing__btn--small">
                  Sign up free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingNav;
