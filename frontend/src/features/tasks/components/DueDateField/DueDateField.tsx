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
  /** The input's name, for isDueDateInputValid when a form has more than one date */
  name?: string;
}

const DUE_DATE_INPUT_NAME = "dueDate";

/**
 * False if the form's date input holds something that isn't a date yet. The browser reports a half-typed
 * date as an empty value, so without this check it would be dropped silently.
 */
export const isDueDateInputValid = (form: HTMLFormElement, name = DUE_DATE_INPUT_NAME) =>
  (form.elements.namedItem(name) as HTMLInputElement).validity.valid;

// A date input within the range the backend accepts; used for due dates and start dates
const DueDateField = ({ id, label, value, onChange, error, name = DUE_DATE_INPUT_NAME }: DueDateFieldProps) => {
  return (
    <div className={task.field}>
      <label htmlFor={id} className={task.label}>{label}</label>
      <input
        id={id}
        name={name}
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
