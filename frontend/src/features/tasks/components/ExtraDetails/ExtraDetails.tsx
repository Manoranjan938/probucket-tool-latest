import React, { useState } from "react";
import { Autocomplete, Dialog, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiFlag, FiX } from "react-icons/fi";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";

import * as task from "features/tasks/styles/taskClasses";

import DueBadge from "features/tasks/components/DueBadge/DueBadge";
import DueDateDialog from "features/tasks/components/DueDateDialog/DueDateDialog";
import useUpdateTask from "features/tasks/hooks/useUpdateTask";
import { formatDate, formatEnum, priorityColors, toastOptions } from "features/tasks/data";
import type { RootState } from "app/store";

interface AssigneeOption {
  name: string;
  email: string;
}

// The task's assignee, priority and dates, with dialogs to change the assignee and the due date
const ExtraDetails = ({ onChanged, myTeams, currentTask, currentProject }: { onChanged: () => void } & Props) => {
  const [showAssigneeDialog, setShowAssigneeDialog] = useState(false);
  const [showDueDateDialog, setShowDueDateDialog] = useState(false);
  const [assignee, setAssignee] = useState<AssigneeOption | null>(null);
  const [saving, setSaving] = useState(false);
  const [updateTask] = useUpdateTask();
  const { enqueueSnackbar } = useSnackbar();

  const assigneeName = currentTask.assignee && currentTask.assignee !== "NA" ? currentTask.assignee : null;

  // The team board fills the team list, so on a personal project it can still hold another project's members.
  // The project lead isn't a team member, but can be assigned too.
  const team = currentProject.projectType?.toLowerCase() === "team" ? myTeams : [];
  const { leadEmail, leadBy } = currentProject;
  const assigneeOptions: AssigneeOption[] = [
    ...(leadEmail && !team.some((member) => member.email === leadEmail)
      ? [{ name: `${leadBy} (Lead)`, email: leadEmail }]
      : []),
    ...team.map(({ name, email }) => ({ name, email })),
  ];

  const handleClose = () => {
    setShowAssigneeDialog(false);
    setAssignee(null);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!assignee) {
      return;
    }
    setSaving(true);
    try {
      await updateTask({
        taskId: currentTask.taskSequence!,
        status: currentTask.status!,
        assignee: assignee.email,
        priority: currentTask.priority!,
        description: currentTask.taskDesc!,
      });
      enqueueSnackbar("Assignee updated", { ...toastOptions, variant: "success" });
      onChanged();
      handleClose();
    } catch (err) {
      console.log(err);
      enqueueSnackbar("Couldn't update the assignee. Please try again.", { ...toastOptions, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className={task.sideCard}>
        <h3 className={task.sideCardTitle}>Details</h3>
        <div className={task.detailRow}>
          <span className={task.detailLabel}>Assignee</span>
          <span className={task.detailValue}>
            {assigneeName ? (
              <>
                <span className={`${task.avatar} w-6! h-6! text-[11px]!`} aria-hidden="true">
                  {assigneeName.substring(0, 1)}
                </span>
                <span className="truncate">{assigneeName}</span>
              </>
            ) : (
              <span className="font-normal text-brand-muted">Unassigned</span>
            )}
            <button type="button" className={`${task.linkButton} ml-auto`} onClick={() => setShowAssigneeDialog(true)}>
              Change
            </button>
          </span>
        </div>
        <div className={task.detailRow}>
          <span className={task.detailLabel}>Priority</span>
          <span className={task.detailValue}>
            {currentTask.priority ? (
              <>
                <FiFlag className={priorityColors[currentTask.priority] ?? priorityColors.LOW} aria-hidden="true" />
                {formatEnum(currentTask.priority)}
              </>
            ) : (
              <span className="font-normal text-brand-muted">None</span>
            )}
          </span>
        </div>
        <div className={task.detailRow}>
          <span className={task.detailLabel}>Due date</span>
          <span className={task.detailValue}>
            {currentTask.dueDate ? (
              <DueBadge dueDate={currentTask.dueDate} status={currentTask.status} />
            ) : (
              <span className="font-normal text-brand-muted">None</span>
            )}
            <button type="button" className={`${task.linkButton} ml-auto`} onClick={() => setShowDueDateDialog(true)}>
              {currentTask.dueDate ? "Change" : "Set"}
            </button>
          </span>
        </div>
        <div className={task.detailRow}>
          <span className={task.detailLabel}>Created</span>
          <span className={task.detailValue}>{formatDate(currentTask.createdOn) || "–"}</span>
        </div>
        <div className={task.detailRow}>
          <span className={task.detailLabel}>Updated</span>
          <span className={task.detailValue}>{formatDate(currentTask.updatedOn) || "–"}</span>
        </div>
      </div>

      <DueDateDialog
        open={showDueDateDialog}
        onClose={() => setShowDueDateDialog(false)}
        onChanged={onChanged}
        taskId={currentTask.taskSequence}
        dueDate={currentTask.dueDate}
      />

      <Dialog
        open={showAssigneeDialog}
        onClose={handleClose}
        PaperProps={{ className: task.dialogPaper }}
        aria-labelledby="assignee-dialog-title"
      >
        <form onSubmit={handleUpdate} noValidate>
          <div className={task.dialogHeader}>
            <h2 id="assignee-dialog-title" className={task.dialogTitle}>Change assignee</h2>
            <button type="button" className={task.iconButton} onClick={handleClose} aria-label="Close">
              <FiX />
            </button>
          </div>
          <div className={task.dialogBody}>
            <Autocomplete
              fullWidth
              value={assignee}
              onChange={(event, value) => setAssignee(value)}
              options={assigneeOptions}
              autoHighlight
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.email === value.email}
              noOptionsText="Nobody to assign in this project"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign to"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill
                  }}
                />
              )}
            />
          </div>
          <div className={task.dialogFooter}>
            <button type="button" className={task.btnGhost} onClick={handleClose}>Cancel</button>
            <button type="submit" className={task.btnPrimary} disabled={!assignee || saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  myTeams: state.teams.allTeamMember,
  currentTask: state.tasks.selectedTask,
  currentProject: state.project.project,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(ExtraDetails);
