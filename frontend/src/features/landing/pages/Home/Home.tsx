import React from "react";
import Helmet from "react-helmet";

import * as landing from "features/landing/styles/landingClasses";

import LandingNav from "features/landing/components/LandingNav/LandingNav";
import Hero from "features/landing/components/Hero/Hero";
import Features from "features/landing/components/Features/Features";
import ProjectTypes from "features/landing/components/ProjectTypes/ProjectTypes";
import HowItWorks from "features/landing/components/HowItWorks/HowItWorks";
import ComingSoon from "features/landing/components/ComingSoon/ComingSoon";
import Pricing from "features/landing/components/Pricing/Pricing";
import CallToAction from "features/landing/components/CallToAction/CallToAction";
import Footer from "features/landing/components/Footer/Footer";
import { useAppSelector } from "app/hooks";
import { selectIsLoggedIn } from "features/auth/store/securitySlice";

const Home = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <div className={landing.page}>
      <Helmet>
        <title>ProBucket | Plan, track and ship your projects</title>
      </Helmet>
      <LandingNav isLoggedIn={isLoggedIn} />
      <main>
        <Hero isLoggedIn={isLoggedIn} />
        <Features />
        <ProjectTypes />
        <HowItWorks />
        <ComingSoon />
        <Pricing />
        <CallToAction isLoggedIn={isLoggedIn} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
