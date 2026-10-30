import React from "react";
import { Link } from "react-router-dom";

import "./Pricing.css";

import { plans } from "features/landing/data";

const Pricing = () => {
  return (
    <section id="pricing" className="landing__section">
      <div className="landing__container">
        <div className="landing__section__header">
          <span className="landing__eyebrow">Pricing</span>
          <h2>Simple plans</h2>
        </div>

        <div className="landing__plans">
          {plans.map((plan) => (
            <div className="landing__plan" key={plan.name}>
              <h3>{plan.name}</h3>
              <div className="landing__plan__price">{plan.price}</div>
              <div className="landing__plan__period">{plan.period}</div>
              <div className="landing__plan__users">{plan.users}</div>
              <Link to="/signup" className="landing__btn landing__btn--primary landing__btn--block">
                Get Started
              </Link>
              <p className="landing__plan__note">{plan.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
