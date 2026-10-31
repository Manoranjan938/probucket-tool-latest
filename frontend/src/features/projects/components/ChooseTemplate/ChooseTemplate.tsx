import React from "react";

import * as project from "features/projects/styles/projectClasses";

import OptionCard from "features/projects/components/OptionCard/OptionCard";
import { templates } from "features/projects/data";

interface ChooseTemplateProps {
  value: string;
  onChange: (value: string) => void;
}

// Step 1 of the Create project wizard
const ChooseTemplate = ({ value, onChange }: ChooseTemplateProps) => {
  return (
    <>
      <h2 id="choose-template-title" className={project.stepTitle}>Choose a template</h2>
      <p className={project.stepText}>Pick what this project will be used for.</p>

      <div role="radiogroup" aria-labelledby="choose-template-title" className={project.optionGrid}>
        {templates.map((option) => (
          <OptionCard
            key={option.value}
            name="project-template"
            option={option}
            checked={value === option.value}
            onChange={onChange}
          />
        ))}
      </div>
    </>
  );
};

export default ChooseTemplate;
