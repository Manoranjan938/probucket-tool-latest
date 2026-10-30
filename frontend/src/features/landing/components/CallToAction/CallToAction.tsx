import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import * as landing from "features/landing/styles/landingClasses";

const CallToAction = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <section className="pb-24 max-[768px]:pb-16">
      <div className={landing.container}>
        <div className="py-16 px-8 rounded-[20px] bg-[linear-gradient(135deg,#5f59c9_0%,#827ed8_100%)] text-center max-[768px]:py-12 max-[768px]:px-6">
          <h2 className="mb-3 text-[34px] font-bold leading-[1.2] tracking-[-0.02em] text-white max-[768px]:text-[26px]">
            Ready to organize your next project?
          </h2>
          <p className="max-w-[520px] mx-auto mb-8 text-[18px] text-[rgba(255,255,255,0.9)] max-[768px]:text-[16px]">
            Create a project, add your first tasks and see the work come together.
          </p>
          {isLoggedIn ? (
            <Link to="/projects" className={landing.btnCta}>
              Go to my projects <FaArrowRight />
            </Link>
          ) : (
            <Link to="/signup" className={landing.btnCta}>
              Get started free <FaArrowRight />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
