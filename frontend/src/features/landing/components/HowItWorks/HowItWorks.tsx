import React from "react";

import * as landing from "features/landing/styles/landingClasses";

import { steps } from "features/landing/data";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className={landing.section}>
      <div className={landing.container}>
        <div className={landing.sectionHeader}>
          <span className={landing.eyebrow}>How it works</span>
          <h2 className={landing.sectionTitle}>Up and running in three steps</h2>
        </div>

        <ol className="grid grid-cols-[repeat(3,1fr)] gap-8 p-0 list-none max-[768px]:grid-cols-[1fr] max-[768px]:gap-10">
          {steps.map((step, index) => (
            // The ::after is the connector line between the step numbers
            <li
              className="relative text-center not-last:after:content-[''] not-last:after:absolute not-last:after:top-6 not-last:after:left-[calc(50%_+_40px)] not-last:after:w-[calc(100%_-_80px_+_32px)] not-last:after:h-0.5 not-last:after:bg-brand-border max-[768px]:not-last:after:hidden"
              key={step.title}
            >
              <span className="inline-flex items-center justify-center w-12 h-12 mb-5 rounded-[50%] bg-brand-strong text-[20px] font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mb-2 text-[18px] font-bold text-brand-ink">{step.title}</h3>
              <p className="max-w-[300px] mx-auto text-[15px]">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
