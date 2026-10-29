import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import "./CallToAction.css";

const CallToAction = ({ isLoggedIn }) => {
  return (
    <section className="landing__cta__wrapper">
      <div className="landing__container">
        <div className="landing__cta">
          <h2>Ready to organize your next project?</h2>
          <p>Create a project, add your first tasks and see the work come together.</p>
          {isLoggedIn ? (
            <Link to="/projects" className="landing__btn landing__cta__btn">
              Go to my projects <FaArrowRight />
            </Link>
          ) : (
            <Link to="/signup" className="landing__btn landing__cta__btn">
              Get started free <FaArrowRight />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
