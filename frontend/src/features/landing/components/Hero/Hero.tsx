import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import "./Hero.css";

import BoardPreview from "features/landing/components/BoardPreview/BoardPreview";

const Hero = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <section className="landing__hero">
      <div className="landing__container">
        <div className="landing__hero__content">
          <span className="landing__hero__badge">
            Project management for personal and team projects
          </span>
          <h1>
            Plan, track and ship your projects <span>in one place.</span>
          </h1>
          <p>
            ProBucket brings your projects, tasks and team together. Create a
            project, break the work into tasks and follow every task from To Do
            to Completed.
          </p>
          <div className="landing__hero__actions">
            {isLoggedIn ? (
              <Link to="/projects" className="landing__btn landing__btn--primary">
                Go to my projects <FaArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="landing__btn landing__btn--primary">
                  Get started free <FaArrowRight />
                </Link>
                <Link to="/login" className="landing__btn landing__btn--ghost">
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>

        <BoardPreview />
      </div>
    </section>
  );
};

export default Hero;
