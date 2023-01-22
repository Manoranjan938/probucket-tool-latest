import React from "react";
import { Link } from "react-router-dom";

import "./Notification.css";

const Notification = () => {
  return (
    <>
      <div className="notification__container">
        <div className="notification__avatar">
          <i className="fa fa-user" />
        </div>
        <div className="notification__detail">
          <div className="notification__type">
            <span>New Task</span>
            <div className="notifiation__time">
              <i className="fa fa-clock-o" />
              <span>2min ago</span>
            </div>
          </div>
          <div className="notification__details">
            <h5 className="notification__title">New Task: Check your email</h5>
            <span className="notification__body">
              You have to check your comapny email
            </span>
          </div>
          <div className="notification__extra">
            <Link to="#">See full details</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
