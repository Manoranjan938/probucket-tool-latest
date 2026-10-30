import React from "react";

import { button } from "shared/styles/sharedClasses";

const Button = ({ title }: { title: string }) => {
  return <button className={button}>{title}</button>;
};

export default Button;
