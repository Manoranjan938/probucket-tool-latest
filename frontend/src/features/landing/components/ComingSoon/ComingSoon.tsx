import React from "react";

import * as landing from "features/landing/styles/landingClasses";

import { comingSoon } from "features/landing/data";

const ComingSoon = () => {
  return (
    <section className={landing.sectionAlt}>
      <div className={landing.container}>
        <div className={landing.sectionHeaderSoon}>
          <span className={landing.eyebrow}>Coming soon</span>
          <h2 className={landing.sectionTitle}>More on the way</h2>
          <p className={landing.sectionText}>We are working on these next.</p>
        </div>

        <ul className="flex flex-wrap justify-center gap-3 max-w-[860px] mx-auto p-0 list-none">
          {comingSoon.map((item) => {
            const Icon = item.icon;
            return (
              <li
                className="inline-flex items-center gap-2.5 py-3 px-5 border border-dashed border-[#c9c6ec] rounded-[999px] bg-brand-surface text-[15px] font-semibold text-brand-ink"
                key={item.title}
              >
                <Icon className="text-[16px] text-brand-strong" />
                <span>{item.title}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ComingSoon;
