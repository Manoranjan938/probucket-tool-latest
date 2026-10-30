import React from "react";

import * as landing from "features/landing/styles/landingClasses";

import { features } from "features/landing/data";

const Features = () => {
  return (
    <section id="features" className={landing.section}>
      <div className={landing.container}>
        <div className={landing.sectionHeader}>
          <span className={landing.eyebrow}>Features</span>
          <h2 className={landing.sectionTitle}>Everything you need to keep work moving</h2>
          <p className={landing.sectionText}>
            From the first idea to the last completed task, ProBucket keeps
            your project organized.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(3,1fr)] gap-6 max-[960px]:grid-cols-[repeat(2,1fr)] max-[640px]:grid-cols-[1fr]">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                className="p-7 border border-brand-border rounded-brand bg-brand-surface transition-[border-color,box-shadow] duration-150 ease-[ease] hover:border-[#d4d2f2] hover:shadow-brand"
                key={feature.title}
              >
                <div className="flex items-center justify-center w-11 h-11 mb-[18px] rounded-[10px] bg-brand-soft text-[20px] text-brand-strong">
                  <Icon />
                </div>
                <h3 className="mb-2 text-[18px] font-bold text-brand-ink">{feature.title}</h3>
                <p className="text-[15px]">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
