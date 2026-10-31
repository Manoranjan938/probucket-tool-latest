import React from "react";
import { FiFlag } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import { formatEnum, priorities, priorityColors } from "features/tasks/data";

interface PriorityPickerProps {
  /** Radio group name, unique on the page */
  name: string;
  value: string;
  onChange: (value: string) => void;
}

// Low / Medium / High as a segmented control (radio buttons)
const PriorityPicker = ({ name, value, onChange }: PriorityPickerProps) => {
  return (
    <div role="radiogroup" aria-label="Priority" className={task.segmented}>
      {priorities.map((priority) => (
        <label key={priority} className={task.segment}>
          <input
            type="radio"
            name={name}
            value={priority}
            checked={value === priority}
            onChange={() => onChange(priority)}
            className="sr-only"
          />
          <FiFlag className={priorityColors[priority]} aria-hidden="true" />
          {formatEnum(priority)}
        </label>
      ))}
    </div>
  );
};

export default PriorityPicker;
