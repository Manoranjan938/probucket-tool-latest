import React, { useState } from "react";
import { Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiAlertTriangle, FiCheck, FiCopy, FiX } from "react-icons/fi";

import * as team from "features/team/styles/teamClasses";

import useAddTeamMember from "features/team/hooks/useAddTeamMember";
import { temporaryPassword } from "features/team/data";
import { toastOptions } from "features/tasks/data";
import type { ApiError } from "shared/types";

interface AddMemberProps {
  open: boolean;
  onClose: () => void;
  /** Called after the member is added, to reload the list */
  onAdded: () => void;
  /** The "project" query parameter */
  projectId: string | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Dialog that adds a team member; afterwards it shows the one-time temporary password
const AddMember = ({ open, onClose, onAdded, projectId }: AddMemberProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  // Set once the member is added: who was added and the backend's message with the password
  const [added, setAdded] = useState<{ name: string; message: string } | null>(null);
  const [addTeamMember] = useAddTeamMember();
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    setName("");
    setEmail("");
    setErrors({ name: "", email: "" });
    setAdded(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const memberName = name.trim();
    const memberEmail = email.trim();
    const newErrors = {
      name: memberName ? "" : "Please enter their name",
      email: !memberEmail
        ? "Please enter their email address"
        : EMAIL_PATTERN.test(memberEmail)
          ? ""
          : "Please enter a valid email address",
    };
    setErrors(newErrors);
    if (newErrors.name || newErrors.email) {
      return;
    }

    setSaving(true);
    try {
      const resp = await addTeamMember({ name: memberName, email: memberEmail, projectId: projectId! });
      setAdded({ name: memberName, message: resp.data });
      onAdded();
    } catch (err) {
      const message = (err as ApiError).response?.data?.message;
      enqueueSnackbar(message || "Couldn't add the member. Please try again.", { ...toastOptions, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const password = added ? temporaryPassword(added.message) : null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password!);
      enqueueSnackbar("Password copied", { ...toastOptions, variant: "success" });
    } catch {
      enqueueSnackbar("Couldn't copy – select the password and copy it yourself.", { ...toastOptions, variant: "error" });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ className: team.dialogPaper }}
      aria-labelledby="add-member-title"
    >
      {added ? (
        <>
          <div className={team.dialogHeader}>
            <div>
              <span className={team.successIcon} aria-hidden="true"><FiCheck /></span>
              <h2 id="add-member-title" className={team.dialogTitle}>{added.name} was added</h2>
            </div>
            <button type="button" className={team.iconButton} onClick={handleClose} aria-label="Close">
              <FiX />
            </button>
          </div>
          <div className={team.dialogBody}>
            {password ? (
              <>
                <div className={team.field}>
                  <label htmlFor="temporary-password" className={team.label}>Temporary password</label>
                  <div className={team.inputRow}>
                    <input
                      id="temporary-password"
                      type="text"
                      readOnly
                      value={password}
                      className={team.inputMono}
                      onFocus={(e) => e.target.select()}
                    />
                    <button type="button" className={team.btnGhost} onClick={handleCopy}>
                      <FiCopy aria-hidden="true" />
                      Copy
                    </button>
                  </div>
                  <p className={team.hint}>They sign in with their email address and this password.</p>
                </div>
                <p className={team.notice}>
                  <FiAlertTriangle className="shrink-0 mt-0.5 text-[#b7791f]" aria-hidden="true" />
                  Copy it now and share it with them – it won't be shown again.
                </p>
              </>
            ) : (
              <p className="text-[15px]">{added.message}</p>
            )}
          </div>
          <div className={team.dialogFooter}>
            <button type="button" className={team.btnPrimary} onClick={handleClose}>Done</button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className={team.dialogHeader}>
            <div>
              <h2 id="add-member-title" className={team.dialogTitle}>Add team member</h2>
              <p className={team.dialogSubtitle}>They get an account and a temporary password.</p>
            </div>
            <button type="button" className={team.iconButton} onClick={handleClose} aria-label="Close">
              <FiX />
            </button>
          </div>

          <div className={team.dialogBody}>
            <div className={team.field}>
              <label htmlFor="member-name" className={team.label}>Name</label>
              <input
                id="member-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors({ ...errors, name: "" });
                }}
                className={team.input}
                placeholder="e.g. Asha Rao"
                autoComplete="off"
                autoFocus
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "member-name-error" : undefined}
              />
              {errors.name ? <p id="member-name-error" className={team.error}>{errors.name}</p> : null}
            </div>
            <div className={team.field}>
              <label htmlFor="member-email" className={team.label}>Email address</label>
              <input
                id="member-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                className={team.input}
                placeholder="name@company.com"
                autoComplete="off"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "member-email-error" : undefined}
              />
              {errors.email ? <p id="member-email-error" className={team.error}>{errors.email}</p> : null}
            </div>
          </div>

          <div className={team.dialogFooter}>
            <button type="button" className={team.btnGhost} onClick={handleClose}>Cancel</button>
            <button type="submit" className={team.btnPrimary} disabled={saving}>
              {saving ? "Adding…" : "Add member"}
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
};

export default AddMember;
