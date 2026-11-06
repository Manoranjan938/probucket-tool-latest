import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

import * as task from "features/tasks/styles/taskClasses";

import LabelChip from "features/tasks/components/LabelChip/LabelChip";
import { MAX_LABEL_LENGTH, MAX_LABELS, tidyLabels } from "features/tasks/data";

interface LabelsFieldProps {
  id: string;
  value: string[];
  onChange: (labels: string[]) => void;
  /** Labels the project already uses */
  suggestions: string[];
}

// Free-text labels with the project's labels as suggestions. Enter, a comma or leaving the field adds what was typed.
const LabelsField = ({ id, value, onChange, suggestions }: LabelsFieldProps) => {
  const [typed, setTyped] = useState("");
  const full = value.length >= MAX_LABELS;
  const change = (labels: string[]) => onChange(tidyLabels(labels, suggestions));

  return (
    <>
      <Autocomplete
        id={id}
        multiple
        freeSolo
        autoSelect
        size="small"
        value={value}
        onChange={(event, labels) => change(labels)}
        inputValue={typed}
        onInputChange={(event, text) => setTyped(text)}
        options={suggestions}
        filterSelectedOptions
        // Case doesn't matter: "ui" is already on the task when "UI" is
        filterOptions={(options, { inputValue }) => {
          const search = inputValue.trim().toLowerCase();
          const taken = new Set(value.map((label) => label.toLowerCase()));
          return options.filter((option) => !taken.has(option.toLowerCase()) && option.toLowerCase().includes(search));
        }}
        getOptionDisabled={() => full}
        renderTags={(labels, getTagProps) =>
          labels.map((label, index) => {
            const { key, onDelete } = getTagProps({ index });
            return <LabelChip key={key} label={label} onRemove={onDelete} className="m-0.5" />;
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={full ? "" : value.length ? "Add another" : "e.g. frontend"}
            sx={{ bgcolor: "#fff" }}
            onKeyDown={(e) => {
              // A comma ends a label too
              if (e.key === ",") {
                e.preventDefault();
                if (typed.trim()) {
                  change([...value, typed]);
                  setTyped("");
                }
              }
            }}
            inputProps={{
              ...params.inputProps,
              maxLength: MAX_LABEL_LENGTH,
              readOnly: full,
              "aria-describedby": `${id}-hint`,
            }}
          />
        )}
      />
      <p id={`${id}-hint`} className={task.fieldHint}>
        {full ? `A task can have ${MAX_LABELS} labels at most.` : `Up to ${MAX_LABELS} labels.`}
      </p>
    </>
  );
};

export default LabelsField;
