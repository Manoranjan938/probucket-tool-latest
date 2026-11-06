import React from "react";
import { FiFlag } from "react-icons/fi";

import SegmentedPicker from "features/tasks/components/SegmentedPicker/SegmentedPicker";
import { formatEnum, priorities, priorityColors } from "features/tasks/data";

interface PriorityPickerProps {
  /** Radio group name, unique on the page */
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const options = priorities.map((priority) => ({
  value: priority,
  label: formatEnum(priority),
  icon: FiFlag,
  iconClass: priorityColors[priority],
}));

// Low / Medium / High as a segmented control (radio buttons)
const PriorityPicker = ({ name, value, onChange }: PriorityPickerProps) => (
  <SegmentedPicker name={name} label="Priority" options={options} value={value} onChange={onChange} />
);

export default PriorityPicker;
