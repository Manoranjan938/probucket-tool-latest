import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import * as landing from "features/landing/styles/landingClasses";

import BoardPreview from "features/landing/components/BoardPreview/BoardPreview";

const Hero = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <section className="pt-22 pb-24 [background:radial-gradient(ellipse_80%_60%_at_50%_0%,var(--color-brand-soft)_0%,rgba(241,240,252,0)_70%),var(--color-brand-surface)] max-[768px]:pt-14 max-[768px]:pb-16">
      <div className={landing.container}>
        <div className="max-w-[760px] mx-auto text-center">
          <span className="inline-block mb-6 py-1.5 px-3.5 border border-brand-border rounded-[999px] bg-brand-surface text-[14px] font-medium text-brand-strong">
            Project management for personal and team projects
          </span>
          <h1 className="mb-5 text-[56px] font-extrabold leading-[1.08] tracking-[-0.03em] text-brand-ink max-[768px]:text-[38px]">
            Plan, track and ship your projects <span className="text-brand-strong">in one place.</span>
          </h1>
          <p className="max-w-[600px] mx-auto text-[19px] max-[768px]:text-[17px]">
            ProBucket brings your projects, tasks and team together. Create a
            project, break the work into tasks and follow every task from To Do
            to Completed.
          </p>
          <div className="flex justify-center gap-3 mt-9 max-[768px]:flex-col max-[768px]:items-stretch">
            {isLoggedIn ? (
              <Link to="/projects" className={landing.btnPrimary}>
                Go to my projects <FaArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/signup" className={landing.btnPrimary}>
                  Get started free <FaArrowRight />
                </Link>
                <Link to="/login" className={landing.btnGhost}>
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>

        <BoardPreview />
      </div>
    </section>
  );
};

export default Hero;
