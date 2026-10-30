import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

import * as landing from "features/landing/styles/landingClasses";

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
    <header className="sticky top-0 z-1000 bg-[rgba(255,255,255,0.92)] [backdrop-filter:saturate(180%)_blur(8px)] border-b border-brand-border">
      <div className={`${landing.container} flex items-center gap-8 h-[68px]`}>
        <Link to="/" className={landing.brand}>
          <img src={logo} alt="" className="w-[34px] h-[34px]" />
          <span className={`${landing.brandName} text-[22px]`}>ProBucket</span>
        </Link>

        <button
          type="button"
          className="hidden ml-auto p-2 border-none bg-transparent text-[20px] text-brand-ink cursor-pointer max-[768px]:flex"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div
          className={`flex flex-1 items-center justify-between max-[768px]:absolute max-[768px]:top-[68px] max-[768px]:left-0 max-[768px]:right-0 max-[768px]:flex-col max-[768px]:items-stretch max-[768px]:gap-4 max-[768px]:pt-4 max-[768px]:px-6 max-[768px]:pb-6 max-[768px]:bg-brand-surface max-[768px]:border-b max-[768px]:border-brand-border max-[768px]:shadow-brand ${
            menuOpen ? "" : "max-[768px]:hidden"
          }`}
        >
          <nav className="flex gap-7 max-[768px]:flex-col max-[768px]:gap-1">
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-[15px] font-medium text-brand-text no-underline transition-[color] duration-150 ease-[ease] hover:text-brand-strong max-[768px]:py-2.5 max-[768px]:text-[16px]"
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.title}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5 max-[768px]:flex-col max-[768px]:items-stretch max-[768px]:gap-3 max-[768px]:pt-4 max-[768px]:border-t max-[768px]:border-brand-border">
            {isLoggedIn ? (
              <Link to="/projects" className={landing.btnPrimarySmall}>
                Go to my projects
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[15px] font-medium text-brand-text no-underline transition-[color] duration-150 ease-[ease] hover:text-brand-strong max-[768px]:text-center max-[768px]:py-2.5 max-[768px]:text-[16px]"
                >
                  Log in
                </Link>
                <Link to="/signup" className={landing.btnPrimarySmall}>
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
