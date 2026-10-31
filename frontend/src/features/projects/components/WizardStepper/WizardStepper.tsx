import React from "react";
import { FaCheck } from "react-icons/fa";

import * as project from "features/projects/styles/projectClasses";

interface WizardStepperProps {
  steps: string[];
  current: number;
  /** Called when a finished step is clicked, to go back to it */
  onStepClick: (step: number) => void;
}

// Progress of the Create project wizard. Finished steps are buttons that go back to that step.
const WizardStepper = ({ steps, current, onStepClick }: WizardStepperProps) => {
  return (
    <ol className={project.stepper}>
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;

        const dotClass = done ? project.stepDotDone : active ? project.stepDotActive : project.stepDotUpcoming;
        const labelClass = active
          ? project.stepLabelActive
          : done
            ? project.stepLabel
            : project.stepLabelUpcoming;

        const content = (
          <>
            <span className={dotClass} aria-hidden="true">
              {done ? <FaCheck /> : index + 1}
            </span>
            <span className={labelClass}>
              {step}
              {done ? <span className="sr-only"> (completed)</span> : null}
            </span>
          </>
        );

        return (
          <li key={step} className={project.stepItem} aria-current={active ? "step" : undefined}>
            {done ? (
              <button type="button" className={project.stepButton} onClick={() => onStepClick(index)}>
                {content}
              </button>
            ) : (
              <div className={project.step}>{content}</div>
            )}
            {index < steps.length - 1 ? (
              <span className={done ? project.stepLineDone : project.stepLineUpcoming} aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
};

export default WizardStepper;
