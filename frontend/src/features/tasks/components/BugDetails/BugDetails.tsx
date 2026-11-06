import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

import * as task from "features/tasks/styles/taskClasses";

import SeverityPicker from "features/tasks/components/SeverityPicker/SeverityPicker";
import { useUpdateBugDetailsMutation } from "features/tasks/api/tasksApi";
import { MAX_DESCRIPTION, toastOptions } from "features/tasks/data";
import type { TaskDetails } from "features/tasks/types";
import { getApiErrorMessage } from "shared/services/apiError";

interface BugFields {
  severity: string;
  stepsToReproduce: string;
  expectedResult: string;
  actualResult: string;
}

const savedFields = (bug: Partial<TaskDetails>): BugFields => ({
  severity: bug.severity ?? "",
  stepsToReproduce: bug.stepsToReproduce ?? "",
  expectedResult: bug.expectedResult ?? "",
  actualResult: bug.actualResult ?? "",
});

// What only a bug has: its severity, how to reproduce it, and what should and does happen. Saved together.
const BugDetails = ({ bug }: { bug: Partial<TaskDetails> }) => {
  const saved = savedFields(bug);
  const [fields, setFields] = useState<BugFields>(saved);
  const [saving, setSaving] = useState(false);
  const [updateBugDetails] = useUpdateBugDetailsMutation();
  const { enqueueSnackbar } = useSnackbar();

  // Again when another bug opens, or this one was saved
  const { taskSequence, severity, stepsToReproduce, expectedResult, actualResult } = bug;
  useEffect(() => {
    setFields(savedFields({ severity, stepsToReproduce, expectedResult, actualResult }));
  }, [taskSequence, severity, stepsToReproduce, expectedResult, actualResult]);

  const trimmed = (value: string) => value.trim();
  const changed =
    fields.severity !== saved.severity ||
    trimmed(fields.stepsToReproduce) !== saved.stepsToReproduce ||
    trimmed(fields.expectedResult) !== saved.expectedResult ||
    trimmed(fields.actualResult) !== saved.actualResult;
  const edited = JSON.stringify(fields) !== JSON.stringify(saved);

  const update = (field: keyof BugFields) => (value: string) => setFields((current) => ({ ...current, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBugDetails({
        taskId: bug.taskSequence!,
        severity: fields.severity,
        stepsToReproduce: trimmed(fields.stepsToReproduce),
        expectedResult: trimmed(fields.expectedResult),
        actualResult: trimmed(fields.actualResult),
      }).unwrap();
      enqueueSnackbar("Bug details saved", { ...toastOptions, variant: "success" });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(getApiErrorMessage(err, "Couldn't save the bug details. Please try again."), { ...toastOptions, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={task.section} aria-labelledby="bug-details-title">
      <h3 id="bug-details-title" className={task.sectionTitle}>Bug details</h3>
      <div className={task.field}>
        <span className={task.label}>Severity</span>
        <SeverityPicker name="bug-severity" value={fields.severity} onChange={update("severity")} />
        {fields.severity ? null : <p className={task.fieldHint}>Not set</p>}
      </div>
      <div className={task.field}>
        <label htmlFor="bug-steps" className={task.label}>Steps to reproduce</label>
        <textarea
          id="bug-steps"
          className={task.textarea}
          placeholder="How to make it happen"
          value={fields.stepsToReproduce}
          onChange={(e) => update("stepsToReproduce")(e.target.value)}
          maxLength={MAX_DESCRIPTION}
        />
      </div>
      <div className={task.bugResults}>
        <div className={task.field}>
          <label htmlFor="bug-expected" className={task.label}>Expected result</label>
          <textarea
            id="bug-expected"
            className={task.textarea}
            placeholder="What should happen"
            value={fields.expectedResult}
            onChange={(e) => update("expectedResult")(e.target.value)}
            maxLength={MAX_DESCRIPTION}
          />
        </div>
        <div className={task.field}>
          <label htmlFor="bug-actual" className={task.label}>Actual result</label>
          <textarea
            id="bug-actual"
            className={task.textarea}
            placeholder="What happens instead"
            value={fields.actualResult}
            onChange={(e) => update("actualResult")(e.target.value)}
            maxLength={MAX_DESCRIPTION}
          />
        </div>
      </div>
      {/* Only while there's something to save */}
      <div className={task.formActions}>
        <button
          type="button"
          className={`${task.btnPrimary} ${task.btnSmall}`}
          onClick={handleSave}
          disabled={!changed || saving}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          className={`${task.btnGhost} ${task.btnSmall}`}
          onClick={() => setFields(saved)}
          disabled={!edited || saving}
        >
          Cancel
        </button>
      </div>
    </section>
  );
};

export default BugDetails;
