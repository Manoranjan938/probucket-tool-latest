import React from "react";
import type { IconType } from "react-icons";

import * as task from "features/tasks/styles/taskClasses";

export interface SegmentOption {
  value: string;
  label: string;
  icon: IconType;
  /** Text colour of the icon */
  iconClass?: string;
}

interface SegmentedPickerProps {
  /** Radio group name, unique on the page */
  name: string;
  label: string;
  options: SegmentOption[];
  /** Empty when nothing is picked yet */
  value: string;
  onChange: (value: string) => void;
}

// A segmented control of radio buttons, one segment per option
const SegmentedPicker = ({ name, label, options, value, onChange }: SegmentedPickerProps) => {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={task.segmented}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => (
        <label key={option.value} className={task.segment}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          <option.icon className={option.iconClass} aria-hidden="true" />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default SegmentedPicker;
