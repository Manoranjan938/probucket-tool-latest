import React from "react";

import "./Services.css";

import { IoBug } from "react-icons/io5";
import { FaHeadset, FaProjectDiagram } from "react-icons/fa";

const Services = () => {
  return (
    <div className="service_container">
      <h1>Our Services</h1>
      <div className="service__wrapper">
        <div className="service__card">
          <div className="service__card__header">
            <FaProjectDiagram className="service__icon project" />
            <h2>Project Management</h2>
          </div>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Dignissimos perferendis
          </p>
        </div>
        <div className="service__card">
          <div className="service__card__header">
            <IoBug className="service__icon bug" />
            <h2>Bug Tracking</h2>
          </div>

          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Dignissimos perferendis
          </p>
        </div>
        <div className="service__card">
          <div className="service__card__header">
            <FaHeadset className="service__icon headset" />
            <h2>24/7 Support</h2>
          </div>

          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Dignissimos perferendis
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
