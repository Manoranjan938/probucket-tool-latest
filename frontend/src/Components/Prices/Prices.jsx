import React from "react";

import "./Prices.css";

const Prices = () => {
  return (
    <div className="price__container">
      <h1>Simple plans</h1>
      <div className="price__cards">
        <div className="price__card">
          <div className="price__header">
            <h3>Personal</h3>
          </div>
          <div className="price__body">
            <h1>INR 0</h1>
            <h5>for user/month</h5>
            <span>up to single user</span>
            <button className="price__btn btn">Get Started</button>
            <p>Free Forever</p>
          </div>
        </div>
        <div className="price__card">
          <div className="price__header">
            <h3>Team</h3>
          </div>
          <div className="price__body">
            <h1>INR 199</h1>
            <h5>for whole team</h5>
            <span>Free up to 5-6 user</span>
            <button className="price__btn btn" >Get Started</button>
            <p>Starts at 2,199/year</p>
          </div>
        </div>
        <div className="price__card">
          <div className="price__header">
            <h3>Enterprise</h3>
          </div>
          <div className="price__body">
            <h1>INR 599</h1>
            <h5>for whole organization</h5>
            <span>up to 15-20 user</span>
            <button  className="price__btn btn">Get Started</button>
            <p>Starts at 6,999/year</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prices;
