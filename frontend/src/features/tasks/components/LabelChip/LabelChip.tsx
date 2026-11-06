import React from "react";
import { FiX } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import { labelColor } from "features/tasks/data";

interface LabelChipProps {
  label: string;
  /** Shows a remove button; gets its click, as MUI's tag onDelete expects */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

// A label in its own colours, which are the same wherever it appears
const LabelChip = ({ label, onRemove, className = "" }: LabelChipProps) => (
  <span className={`${task.labelChip} ${labelColor(label)} ${className}`}>
    {label}
    {onRemove ? (
      <button type="button" className={task.labelRemove} onClick={onRemove} aria-label={`Remove label ${label}`}>
        <FiX aria-hidden="true" />
      </button>
    ) : null}
  </span>
);

export default LabelChip;
