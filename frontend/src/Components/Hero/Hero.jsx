import Button from "Components/Button/Button";
import React from "react";

import "./Hero.css";

const Hero = () => {
  return (
    <div className="hero__container">
      <div className="hero">
        <h1>Built for personal and professional teams</h1>
        <p>
          Probucket is more than just project management. Probucket gives teams
          one place to plan projects, manage, test and develope projects.
        </p>
        <div className="free_product_btn">
          <Button title="Get it free" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
