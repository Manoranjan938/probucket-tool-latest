import React from "react";

import { features } from "features/landing/data";

// Brand panel shown next to the Login, Forgot and ResetPassword forms (styles in features/auth/styles/Auth.css)
const AuthPanel = () => {
  return (
    <aside className="auth__panel">
      <div className="auth__panel__inner">
        <h2 className="auth__panel__title">Plan, track and ship your projects in one place.</h2>
        <p className="auth__panel__text">
          ProBucket brings your projects, tasks and team together.
        </p>
        <ul className="auth__panel__list">
          {/* Task board, Priorities & assignees and Subtasks – same copy as the landing page */}
          {features.slice(1, 4).map((feature) => (
            <li key={feature.title}>
              <span className="auth__panel__icon">
                <feature.icon />
              </span>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default AuthPanel;
