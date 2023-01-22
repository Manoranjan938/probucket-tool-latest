import React from "react";

import "./About.css";

import about from "Images/about.png";

const About = () => {
  return (
    <div className="about__container">
      <h1>About us</h1>
      <div className="about__wrapper">
        <img src={about} alt="" />
        <div className="about__content">
          <h1>Build quality software</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
            laudantium, neque odio in dolores consequuntur eius voluptas rem!
            Numquam fugit, unde itaque magni neque quos eligendi voluptate ea
            debitis obcaecati?
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
