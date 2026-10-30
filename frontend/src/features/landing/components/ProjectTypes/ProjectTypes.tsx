import React from "react";
import { FaCheck } from "react-icons/fa";

import * as landing from "features/landing/styles/landingClasses";

import personal from "shared/assets/images/new-personal.png";
import team from "shared/assets/images/new-team.png";
import { projectTypes } from "features/landing/data";

const images = { personal, team };

const ProjectTypes = () => {
  return (
    <section className={landing.sectionAlt}>
      <div className={landing.container}>
        <div className={landing.sectionHeader}>
          <span className={landing.eyebrow}>Personal or team</span>
          <h2 className={landing.sectionTitle}>Work solo or bring your team along</h2>
          <p className={landing.sectionText}>
            Every project is either personal or shared with a team. Pick the
            one that fits when you create it.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(2,1fr)] gap-6 max-w-[960px] mx-auto max-[768px]:grid-cols-[1fr]">
          {projectTypes.map((item) => (
            <div
              className="flex gap-6 p-8 border border-brand-border rounded-brand bg-brand-surface max-[768px]:flex-col max-[768px]:gap-4 max-[768px]:p-6"
              key={item.type}
            >
              <img
                src={images[item.type]}
                alt=""
                className="shrink-0 w-24 h-24 object-contain max-[768px]:w-[72px] max-[768px]:h-[72px]"
              />
              <div>
                <h3 className="mb-1.5 text-[20px] font-bold text-brand-ink">{item.title}</h3>
                <p className="mb-[18px] text-[15px]">{item.description}</p>
                <ul className="flex flex-col gap-2.5 p-0 list-none">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-[15px] text-brand-ink">
                      <FaCheck className="shrink-0 mt-[5px] text-[12px] text-brand-strong" />
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
