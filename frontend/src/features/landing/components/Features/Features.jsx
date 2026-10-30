import React from "react";

import "./Features.css";

import { features } from "features/landing/data";

const Features = () => {
  return (
    <section id="features" className="landing__section">
      <div className="landing__container">
        <div className="landing__section__header">
          <span className="landing__eyebrow">Features</span>
          <h2>Everything you need to keep work moving</h2>
          <p>
            From the first idea to the last completed task, ProBucket keeps
            your project organized.
          </p>
        </div>

        <div className="landing__features">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div className="landing__feature" key={feature.title}>
                <div className="landing__feature__icon">
                  <Icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
