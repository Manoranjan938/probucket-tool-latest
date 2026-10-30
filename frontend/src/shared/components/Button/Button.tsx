import React from "react";

import "./Button.css";

const Button = ({ title }: { title: string }) => {
  return <button className="btn">{title}</button>;
};

export default Button;
