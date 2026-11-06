import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

import SegmentedPicker from "features/tasks/components/SegmentedPicker/SegmentedPicker";
import { formatEnum, severities, severityColors } from "features/tasks/data";

interface SeverityPickerProps {
  /** Radio group name, unique on the page */
  name: string;
  /** Empty while no severity is set */
  value: string;
  onChange: (value: string) => void;
}

const options = severities.map((severity) => ({
  value: severity,
  label: formatEnum(severity),
  icon: FiAlertTriangle,
  iconClass: severityColors[severity],
}));

// Minor / Major / Critical for a bug; nothing is picked until someone chooses
const SeverityPicker = ({ name, value, onChange }: SeverityPickerProps) => (
  <SegmentedPicker name={name} label="Severity" options={options} value={value} onChange={onChange} />
);

export default SeverityPicker;
