import React from "react";

import * as task from "features/tasks/styles/taskClasses";

import { MAX_DUE_DATE, MIN_DUE_DATE } from "features/tasks/data";

interface DueDateFieldProps {
  id: string;
  label: string;
  /** yyyy-mm-dd, or empty */
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const DUE_DATE_INPUT_NAME = "dueDate";

/**
 * False if the form's date input holds something that isn't a date yet. The browser reports a half-typed
 * date as an empty value, so without this check it would be dropped silently.
 */
export const isDueDateInputValid = (form: HTMLFormElement) =>
  (form.elements.namedItem(DUE_DATE_INPUT_NAME) as HTMLInputElement).validity.valid;

const DueDateField = ({ id, label, value, onChange, error }: DueDateFieldProps) => {
  return (
    <div className={task.field}>
      <label htmlFor={id} className={task.label}>{label}</label>
      <input
        id={id}
        name={DUE_DATE_INPUT_NAME}
        type="date"
        min={MIN_DUE_DATE}
        max={MAX_DUE_DATE}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={task.input}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? <p id={`${id}-error`} className={task.error}>{error}</p> : null}
    </div>
  );
};

export default DueDateField;
