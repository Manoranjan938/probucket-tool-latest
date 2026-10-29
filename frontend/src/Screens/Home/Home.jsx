import React from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { compose } from "redux";

import "./Home.css";

import LandingNav from "./sections/LandingNav";
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import ProjectTypes from "./sections/ProjectTypes";
import HowItWorks from "./sections/HowItWorks";
import ComingSoon from "./sections/ComingSoon";
import Pricing from "./sections/Pricing";
import CallToAction from "./sections/CallToAction";
import Footer from "./sections/Footer";

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
