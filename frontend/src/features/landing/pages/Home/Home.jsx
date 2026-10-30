import React from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { compose } from "redux";

import "./Home.css";

import LandingNav from "features/landing/components/LandingNav/LandingNav";
import Hero from "features/landing/components/Hero/Hero";
import Features from "features/landing/components/Features/Features";
import ProjectTypes from "features/landing/components/ProjectTypes/ProjectTypes";
import HowItWorks from "features/landing/components/HowItWorks/HowItWorks";
import ComingSoon from "features/landing/components/ComingSoon/ComingSoon";
import Pricing from "features/landing/components/Pricing/Pricing";
import CallToAction from "features/landing/components/CallToAction/CallToAction";
import Footer from "features/landing/components/Footer/Footer";

const Home = ({ isLoggedIn }) => {
  return (
    <div className="landing">
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

// validToken stays true after logout (payload is {}), so check the user id instead
const mapStateToProps = (state) => ({
  isLoggedIn: Boolean(state.security.user && state.security.user.id),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(Home);
