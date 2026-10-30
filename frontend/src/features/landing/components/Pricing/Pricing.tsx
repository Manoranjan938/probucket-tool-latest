import React from "react";
import { Link } from "react-router-dom";

import * as landing from "features/landing/styles/landingClasses";

import { plans } from "features/landing/data";

const Pricing = () => {
  return (
    <section id="pricing" className={landing.section}>
      <div className={landing.container}>
        <div className={landing.sectionHeader}>
          <span className={landing.eyebrow}>Pricing</span>
          <h2 className={landing.sectionTitle}>Simple plans</h2>
        </div>

        <div className="grid grid-cols-[repeat(3,1fr)] gap-6 max-w-[1000px] mx-auto max-[960px]:grid-cols-[1fr] max-[960px]:max-w-[420px]">
          {plans.map((plan) => (
            <div
              className="flex flex-col p-8 border border-brand-border rounded-brand bg-brand-surface shadow-brand text-center"
              key={plan.name}
            >
              <h3 className="mb-5 text-[15px] font-bold tracking-[0.08em] uppercase text-brand-strong">{plan.name}</h3>
              <div className="text-[40px] font-extrabold leading-[1.1] tracking-[-0.02em] text-brand-ink">{plan.price}</div>
              <div className="mt-1.5 text-[15px] text-brand-muted">{plan.period}</div>
              <div className="mt-5 mb-7 py-2.5 border-t border-b border-brand-border text-[15px] font-medium text-brand-ink">
                {plan.users}
              </div>
              <Link to="/signup" className={`${landing.btnPrimary} w-full mt-auto`}>
                Get Started
              </Link>
              <p className="mt-3.5 text-[14px] text-brand-muted">{plan.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
