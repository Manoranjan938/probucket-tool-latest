import React from "react";

import { features } from "features/landing/data";
import * as auth from "features/auth/styles/authClasses";

// Brand panel shown next to the Login, Forgot and ResetPassword forms (classes in features/auth/styles/authClasses.ts)
const AuthPanel = () => {
  return (
    <aside className={auth.panel}>
      <div className={auth.panelInner}>
        <h2 className={auth.panelTitle}>Plan, track and ship your projects in one place.</h2>
        <p className={auth.panelText}>
          ProBucket brings your projects, tasks and team together.
        </p>
        <ul className={auth.panelList}>
          {/* Task board, Priorities & assignees and Subtasks – same copy as the landing page */}
          {features.slice(1, 4).map((feature) => (
            <li key={feature.title} className={auth.panelItem}>
              <span className={auth.panelIcon}>
                <feature.icon />
              </span>
              <div>
                <h3 className={auth.panelItemTitle}>{feature.title}</h3>
                <p className={auth.panelItemText}>{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default AuthPanel;
