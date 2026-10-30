import React from "react";

import "./ComingSoon.css";

import { comingSoon } from "../data";

const ComingSoon = () => {
  return (
    <section className="landing__section landing__section--alt landing__soon">
      <div className="landing__container">
        <div className="landing__section__header">
          <span className="landing__eyebrow">Coming soon</span>
          <h2>More on the way</h2>
          <p>We are working on these next.</p>
        </div>

        <ul className="landing__soon__list">
          {comingSoon.map((item) => {
            const Icon = item.icon;
            return (
              <li className="landing__soon__item" key={item.title}>
                <Icon />
                <span>{item.title}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ComingSoon;
