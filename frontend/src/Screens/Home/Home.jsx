import About from "Components/AboutUs/About";
import Header from "Components/Header/Header";
import Hero from "Components/Hero/Hero";
import New from "Components/NewToProject/New";
import Product from "Components/OurProduct/Product";
import Services from "Components/OurServices/Services";
import Prices from "Components/Prices/Prices";
import React from "react";

const Home = () => {
  return (
    <div className="home">
      <Header />
      <Hero />
      <Product />
      <About />
      <Services />
      <New />
      <Prices />
    </div>
  );
};

export default Home;
