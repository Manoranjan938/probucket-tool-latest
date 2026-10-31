import React from "react";

import * as project from "features/projects/styles/projectClasses";

import OptionCard from "features/projects/components/OptionCard/OptionCard";
import { projectTypes } from "features/projects/data";

interface ChooseTypeProps {
  value: string;
  onChange: (value: string) => void;
}

// Step 2 of the Create project wizard
const ChooseType = ({ value, onChange }: ChooseTypeProps) => {
  return (
    <>
      <h2 id="choose-type-title" className={project.stepTitle}>Who will manage this project?</h2>
      <p className={project.stepText}>This decides which dashboard the project gets.</p>

      <div role="radiogroup" aria-labelledby="choose-type-title" className={project.optionGrid}>
        {projectTypes.map((option) => (
          <OptionCard
            key={option.value}
            name="project-type"
            option={option}
            checked={value === option.value}
            onChange={onChange}
          />
        ))}
      </div>
    </>
  );
};

export default ChooseType;
