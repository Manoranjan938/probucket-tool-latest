import React, { useRef, useState } from "react";
import { Autocomplete, Dialog, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiX } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import DueDateField, { isDueDateInputValid } from "features/tasks/components/DueDateField/DueDateField";
import PriorityPicker from "features/tasks/components/PriorityPicker/PriorityPicker";
import { useCreateTaskMutation } from "features/tasks/api/tasksApi";
import useAssigneeOptions, { type AssigneeOption } from "features/tasks/hooks/useAssigneeOptions";
import { MAX_DESCRIPTION, toastOptions } from "features/tasks/data";
import { useAppSelector } from "app/hooks";
import { getApiErrorMessage } from "shared/services/apiError";

// task_name is a varchar(255)
const MAX_TITLE = 255;

interface NewTaskProps {
  open: boolean;
  onClose: () => void;
  /** projectIdentifier – the "name" query parameter */
  projectIdentifier: string | null;
}

// Dialog that creates a task in the To do column: title and description on the left, the settings on the right
const NewTask = ({ open, onClose, projectIdentifier }: NewTaskProps) => {
  const currentUser = useAppSelector((state) => state.security.user);
  const { options: assigneeOptions, isTeam } = useAssigneeOptions();
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  // undefined until the user picks someone, so the default below applies
  const [pickedAssignee, setPickedAssignee] = useState<AssigneeOption | null>();
  const [priority, setPriority] = useState("LOW");
  const [dueDate, setDueDate] = useState("");
  const [dueDateError, setDueDateError] = useState("");
  const [error, setError] = useState("");
  const [createAnother, setCreateAnother] = useState(false);
  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const [createProjectTask] = useCreateTaskMutation();
  const { enqueueSnackbar } = useSnackbar();

  // On a personal project the only person to assign is you, so that's the default
  const defaultAssignee = isTeam ? null : assigneeOptions.find((option) => option.email === currentUser.username) ?? null;
  const assignee = pickedAssignee === undefined ? defaultAssignee : pickedAssignee;

  const handleClose = () => {
    setTaskName("");
    setDescription("");
    setPickedAssignee(undefined);
    setPriority("LOW");
    setDueDate("");
    setDueDateError("");
    setError("");
    setCreateAnother(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = taskName.trim();
    if (!name) {
      setError("Please describe the task");
      return;
    }
    if (!isDueDateInputValid(e.currentTarget)) {
      setDueDateError("Please enter a valid date");
      return;
    }

    setSaving(true);
    try {
      await createProjectTask({
        projectIdentifier: projectIdentifier!,
        taskName: name,
        description: description.trim(),
        assignee: assignee?.email ?? "",
        priority,
        sprintId: "",
        status: "",
        dueDate,
      }).unwrap();
      enqueueSnackbar("Task created", { ...toastOptions, variant: "success" });
      if (createAnother) {
        // The settings stay for the next task; only what describes this one is cleared
        setTaskName("");
        setDescription("");
        titleRef.current?.focus();
      } else {
        handleClose();
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(getApiErrorMessage(err, "Couldn't create the task. Please try again."), { ...toastOptions, variant: "error" });
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
          <h2 id="new-task-title" className={task.dialogTitle}>New task</h2>
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
                placeholder="Add the details someone needs to start on this task"
                maxLength={MAX_DESCRIPTION}
              />
            </div>
          </div>

          <div className={task.newTaskSide}>
            <div className={task.field}>
              <label htmlFor="new-task-assignee" className={task.label}>Assignee</label>
              <Autocomplete
                id="new-task-assignee"
                size="small"
                value={assignee}
                onChange={(event, value) => setPickedAssignee(value)}
                options={assigneeOptions}
                autoHighlight
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.email === value.email}
                noOptionsText="Nobody to assign in this project"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Unassigned"
                    sx={{ bgcolor: "#fff" }}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
              <p className={task.fieldHint}>Only an assigned task can change its status.</p>
            </div>
            <div className={task.field}>
              <span className={task.label}>Priority</span>
              <PriorityPicker name="new-task-priority" value={priority} onChange={setPriority} />
            </div>
            <DueDateField
              id="new-task-due-date"
              label="Due date (optional)"
              value={dueDate}
              onChange={(value) => {
                setDueDate(value);
                setDueDateError("");
              }}
              error={dueDateError}
            />
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
              {saving ? "Creating…" : "Create task"}
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default NewTask;
