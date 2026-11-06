import React from "react";

import * as task from "features/tasks/styles/taskClasses";

import SegmentedPicker from "features/tasks/components/SegmentedPicker/SegmentedPicker";
import { storyPoints } from "features/tasks/data";

interface StoryPointsPickerProps {
  /** Radio group name, unique on the page */
  name: string;
  /** null while not estimated */
  value: number | null;
  onChange: (value: number | null) => void;
}

const options = storyPoints.map((points) => ({ value: String(points), label: String(points) }));

// 1, 2, 3, 5, 8 or 13 story points, with a way back to no estimate
const StoryPointsPicker = ({ name, value, onChange }: StoryPointsPickerProps) => (
  <>
    <SegmentedPicker
      name={name}
      label="Story points"
      options={options}
      value={value === null ? "" : String(value)}
      onChange={(points) => onChange(Number(points))}
    />
    {value !== null ? (
      <button type="button" className={`${task.linkButton} self-start mt-1 text-[12px]!`} onClick={() => onChange(null)}>
        Clear estimate
      </button>
    ) : null}
  </>
);

export default StoryPointsPicker;
