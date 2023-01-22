import React from "react";

import "./Product.css";

import personal from "Images/personal.png";
import team from "Images/team.png";
import enterprise from "Images/enterprise.png";

const Product = () => {
  return (
    <div className="product__container">
      <h1>Our Product</h1>
      <div className="product__cards">
        <div className="product__card">
          <div className="product__image">
            <img src={personal} alt="" />
          </div>
          <div className="product__content">
              <h2>Personal tool management</h2>
              <p>Free personal management tool with upto support of 3 projects.</p>
          </div>
        </div>
        <div className="product__card">
        <div className="product__image">
            <img src={team} alt="" />
          </div>
          <div className="product__content">
              <h2>Team tool management</h2>
              <p>Free team management tool with upto support of 1 projects.</p>
          </div>
        </div>
        <div className="product__card">
        <div className="product__image">
            <img src={enterprise} alt="" />
          </div>
          <div className="product__content">
              <h2>Enterprise tool management</h2>
              <p>Enterprise management tool with upto support of 3 projects.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
