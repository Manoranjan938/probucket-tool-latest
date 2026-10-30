import React from "react";
import { FaCheck } from "react-icons/fa";

import "./ProjectTypes.css";

import personal from "shared/assets/images/new-personal.png";
import team from "shared/assets/images/new-team.png";
import { projectTypes } from "features/landing/data";

const images = { personal, team };

const ProjectTypes = () => {
  return (
    <section className="landing__section landing__section--alt">
      <div className="landing__container">
        <div className="landing__section__header">
          <span className="landing__eyebrow">Personal or team</span>
          <h2>Work solo or bring your team along</h2>
          <p>
            Every project is either personal or shared with a team. Pick the
            one that fits when you create it.
          </p>
        </div>

        <div className="landing__types">
          {projectTypes.map((item) => (
            <div className="landing__type" key={item.type}>
              <img src={images[item.type]} alt="" />
              <div className="landing__type__content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>
                      <FaCheck />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectTypes;
