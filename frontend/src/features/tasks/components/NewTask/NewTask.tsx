import React, { useRef, useState } from "react";
import { Dialog } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useSnackbar } from "notistack";
import { FaBug } from "react-icons/fa";
import { FiCheckSquare, FiX } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import AssigneePicker from "features/tasks/components/AssigneePicker/AssigneePicker";
import DueDateField, { isDueDateInputValid } from "features/tasks/components/DueDateField/DueDateField";
import LabelsField from "features/tasks/components/LabelsField/LabelsField";
import PriorityPicker from "features/tasks/components/PriorityPicker/PriorityPicker";
import SegmentedPicker from "features/tasks/components/SegmentedPicker/SegmentedPicker";
import SeverityPicker from "features/tasks/components/SeverityPicker/SeverityPicker";
import StoryPointsPicker from "features/tasks/components/StoryPointsPicker/StoryPointsPicker";
import { useCreateTaskMutation, useGetProjectLabelsQuery } from "features/tasks/api/tasksApi";
import useAssigneeOptions, { type AssigneeOption } from "features/tasks/hooks/useAssigneeOptions";
import useCurrentProject from "features/projects/hooks/useCurrentProject";
import { datesClash, isBug, MAX_DESCRIPTION, START_AFTER_DUE, taskTypesFor, toastOptions } from "features/tasks/data";
import { useAppSelector } from "app/hooks";
import { getApiErrorMessage } from "shared/services/apiError";

// task_name is a varchar(255)
const MAX_TITLE = 255;

const START_DATE_INPUT = "startDate";

const typeOptions = [
  { value: "TASK", label: "Task", icon: FiCheckSquare },
  { value: "BUG", label: "Bug", icon: FaBug, iconClass: "text-due-overdue" },
];

interface NewTaskProps {
  open: boolean;
  onClose: () => void;
  /** projectIdentifier – the "name" query parameter */
  projectIdentifier: string | null;
}

// Dialog that creates a task or a bug in the To do column: what it's about on the left, the settings on the right.
// The project's template decides whether it's a task, a bug, or the user's choice.
const NewTask = ({ open, onClose, projectIdentifier }: NewTaskProps) => {
  const currentUser = useAppSelector((state) => state.security.user);
  const { options: assigneeOptions, isTeam } = useAssigneeOptions();
  const taskTypes = taskTypesFor(useCurrentProject().currentData?.projectTemplate);
  // undefined until the user picks one, so the project's default applies
  const [pickedType, setPickedType] = useState<string>();
  const [stepsToReproduce, setStepsToReproduce] = useState("");
  const [expectedResult, setExpectedResult] = useState("");
  const [actualResult, setActualResult] = useState("");
  const [severity, setSeverity] = useState("");
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  // undefined until the user picks someone, so the default below applies
  const [pickedAssignee, setPickedAssignee] = useState<AssigneeOption | null>();
  const [priority, setPriority] = useState("LOW");
  const [dueDate, setDueDate] = useState("");
  const [dueDateError, setDueDateError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [storyPoints, setStoryPoints] = useState<number | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const { data: projectLabels = [] } = useGetProjectLabelsQuery(open && projectIdentifier ? projectIdentifier : skipToken);
  const [error, setError] = useState("");
  const [createAnother, setCreateAnother] = useState(false);
  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const [createProjectTask] = useCreateTaskMutation();
  const { enqueueSnackbar } = useSnackbar();

  // On a personal project the only person to assign is you, so that's the default
  const defaultAssignee = isTeam ? null : assigneeOptions.find((option) => option.email === currentUser.username) ?? null;
  const assignee = pickedAssignee === undefined ? defaultAssignee : pickedAssignee;
  const me = assigneeOptions.find((option) => option.email === currentUser.username);
  const taskType = pickedType && taskTypes.includes(pickedType) ? pickedType : taskTypes[0];
  const bug = isBug(taskType);
  const noun = bug ? "bug" : "task";

  // What describes this one item; the settings are kept for the next one with "Create another"
  const clearContent = () => {
    setTaskName("");
    setDescription("");
    setStepsToReproduce("");
    setExpectedResult("");
    setActualResult("");
  };

  const handleClose = () => {
    clearContent();
    setPickedType(undefined);
    setSeverity("");
    setPickedAssignee(undefined);
    setPriority("LOW");
    setDueDate("");
    setDueDateError("");
    setStartDate("");
    setStartDateError("");
    setStoryPoints(null);
    setLabels([]);
    setError("");
    setCreateAnother(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = taskName.trim();
    if (!name) {
      setError(`Please describe the ${noun}`);
      return;
    }
    if (!isDueDateInputValid(e.currentTarget, START_DATE_INPUT)) {
      setStartDateError("Please enter a valid date");
      return;
    }
    if (!isDueDateInputValid(e.currentTarget)) {
      setDueDateError("Please enter a valid date");
      return;
    }
    if (datesClash(startDate, dueDate)) {
      setStartDateError(START_AFTER_DUE);
      return;
    }

    setSaving(true);
    try {
      await createProjectTask({
        projectIdentifier: projectIdentifier!,
        taskName: name,
        description: description.trim(),
        assignee: assignee?.email ?? "",
        taskType,
        ...(bug
          ? { stepsToReproduce: stepsToReproduce.trim(), expectedResult: expectedResult.trim(), actualResult: actualResult.trim(), severity }
          : {}),
        priority,
        storyPoints,
        startDate,
        labels,
        sprintId: "",
        status: "",
        dueDate,
      }).unwrap();
      enqueueSnackbar(bug ? "Bug created" : "Task created", { ...toastOptions, variant: "success" });
      if (createAnother) {
        clearContent();
        titleRef.current?.focus();
      } else {
        handleClose();
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(getApiErrorMessage(err, `Couldn't create the ${noun}. Please try again.`), { ...toastOptions, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ className: task.newTaskPaper }}
      // MUI's focus trap can move the focus off an autoFocus field (e.g. in StrictMode), so the title is focused again once the dialog is in
      TransitionProps={{ onEntered: () => titleRef.current?.focus() }}
      aria-labelledby="new-task-title"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className={task.dialogHeader}>
          <h2 id="new-task-title" className={task.dialogTitle}>New {noun}</h2>
          <button type="button" className={task.iconButton} onClick={handleClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className={`${task.dialogBody} ${task.newTaskGrid}`}>
          <div>
            <div className={task.field}>
              <label htmlFor="new-task-name" className={task.label}>Title</label>
              <input
                id="new-task-name"
                ref={titleRef}
                value={taskName}
                onChange={(e) => {
                  setTaskName(e.target.value);
                  setError("");
                }}
                className={task.input}
                placeholder="What needs to be done?"
                maxLength={MAX_TITLE}
                autoFocus
                autoComplete="off"
                aria-invalid={!!error}
                aria-describedby={error ? "new-task-error" : undefined}
              />
              {error ? <p id="new-task-error" className={task.error}>{error}</p> : null}
            </div>
            <div className={task.field}>
              <label htmlFor="new-task-description" className={task.label}>Description (optional)</label>
              <textarea
                id="new-task-description"
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={task.textarea}
                placeholder={bug ? "What's wrong, and where?" : "Add the details someone needs to start on this task"}
                maxLength={MAX_DESCRIPTION}
              />
            </div>
            {bug ? (
              <>
                <div className={task.field}>
                  <label htmlFor="new-task-steps" className={task.label}>Steps to reproduce (optional)</label>
                  <textarea
                    id="new-task-steps"
                    rows={4}
                    value={stepsToReproduce}
                    onChange={(e) => setStepsToReproduce(e.target.value)}
                    className={task.textarea}
                    placeholder={"1. Go to …\n2. Click …\n3. See the error"}
                    maxLength={MAX_DESCRIPTION}
                  />
                </div>
                <div className={task.bugResults}>
                  <div className={task.field}>
                    <label htmlFor="new-task-expected" className={task.label}>Expected result</label>
                    <textarea
                      id="new-task-expected"
                      rows={3}
                      value={expectedResult}
                      onChange={(e) => setExpectedResult(e.target.value)}
                      className={task.textarea}
                      placeholder="What should happen"
                      maxLength={MAX_DESCRIPTION}
                    />
                  </div>
                  <div className={task.field}>
                    <label htmlFor="new-task-actual" className={task.label}>Actual result</label>
                    <textarea
                      id="new-task-actual"
                      rows={3}
                      value={actualResult}
                      onChange={(e) => setActualResult(e.target.value)}
                      className={task.textarea}
                      placeholder="What happens instead"
                      maxLength={MAX_DESCRIPTION}
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className={task.newTaskSide}>
            {/* Only projects that track both tasks and bugs offer the choice */}
            {taskTypes.length > 1 ? (
              <div className={task.field}>
                <span className={task.label}>Type</span>
                <SegmentedPicker name="new-task-type" label="Type" options={typeOptions} value={taskType} onChange={setPickedType} />
              </div>
            ) : null}
            <div className={task.field}>
              <div className={task.labelRow}>
                <label htmlFor="new-task-assignee" className={task.label}>Assignee</label>
                {me && assignee?.email !== me.email ? (
                  <button type="button" className={task.linkButton} onClick={() => setPickedAssignee(me)}>
                    Assign to me
                  </button>
                ) : null}
              </div>
              <AssigneePicker
                id="new-task-assignee"
                variant="field"
                assignee={assignee}
                options={assigneeOptions}
                onChange={setPickedAssignee}
              />
              <p className={task.fieldHint}>Only an assigned task can change its status.</p>
            </div>
            <div className={task.field}>
              <span className={task.label}>Priority</span>
              <PriorityPicker name="new-task-priority" value={priority} onChange={setPriority} />
            </div>
            {bug ? (
              <div className={task.field}>
                <span className={task.label}>Severity (optional)</span>
                <SeverityPicker name="new-task-severity" value={severity} onChange={setSeverity} />
              </div>
            ) : null}
            <div className={task.field}>
              <span className={task.label}>Estimate (optional)</span>
              <StoryPointsPicker name="new-task-points" value={storyPoints} onChange={setStoryPoints} />
            </div>
            <DueDateField
              id="new-task-start-date"
              name={START_DATE_INPUT}
              label="Start date (optional)"
              value={startDate}
              onChange={(value) => {
                setStartDate(value);
                setStartDateError("");
              }}
              error={startDateError}
            />
            <DueDateField
              id="new-task-due-date"
              label="Due date (optional)"
              value={dueDate}
              onChange={(value) => {
                setDueDate(value);
                setDueDateError("");
                setStartDateError("");
              }}
              error={dueDateError}
            />
            <div className={task.field}>
              <label htmlFor="new-task-labels" className={task.label}>Labels (optional)</label>
              <LabelsField id="new-task-labels" value={labels} onChange={setLabels} suggestions={projectLabels} />
            </div>
          </div>
        </div>

        <div className={task.newTaskFooter}>
          <label className={task.checkboxLabel}>
            <input
              type="checkbox"
              className={task.checkbox}
              checked={createAnother}
              onChange={(e) => setCreateAnother(e.target.checked)}
            />
            Create another
          </label>
          <div className={task.newTaskButtons}>
            <button type="button" className={task.btnGhost} onClick={handleClose}>Cancel</button>
            <button type="submit" className={task.btnPrimary} disabled={saving}>
              {saving ? "Creating…" : `Create ${noun}`}
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default NewTask;
