import React from "react";

import "./HowItWorks.css";

import { steps } from "../data";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="landing__section">
      <div className="landing__container">
        <div className="landing__section__header">
          <span className="landing__eyebrow">How it works</span>
          <h2>Up and running in three steps</h2>
        </div>

        <ol className="landing__steps">
          {steps.map((step, index) => (
            <li className="landing__step" key={step.title}>
              <span className="landing__step__number">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
