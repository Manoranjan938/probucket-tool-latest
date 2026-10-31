import React from "react";
import { FaCheck } from "react-icons/fa";

import * as project from "features/projects/styles/projectClasses";

import type { ProjectOption } from "features/projects/types";

interface OptionCardProps {
  /** Radio group name – every card in a step shares it, so the arrow keys move between them */
  name: string;
  option: ProjectOption;
  checked: boolean;
  onChange: (value: string) => void;
}

// A template or project type in the Create project wizard: a radio button styled as a card
const OptionCard = ({ name, option, checked, onChange }: OptionCardProps) => {
  const Icon = option.icon;

  return (
    <label className={project.option}>
      <input
        type="radio"
        name={name}
        value={option.value}
        checked={checked}
        disabled={option.comingSoon}
        onChange={() => onChange(option.value)}
        className="peer sr-only"
      />
      <span className={project.optionCheck} aria-hidden="true">
        <FaCheck />
      </span>
      <span className={project.optionIcon} aria-hidden="true">
        <Icon />
      </span>
      <span className={project.optionTitle}>
        {option.title}
        {option.comingSoon ? <span className={project.optionBadge}>Coming soon</span> : null}
      </span>
      <span className={project.optionText}>{option.description}</span>
    </label>
  );
};

export default OptionCard;
