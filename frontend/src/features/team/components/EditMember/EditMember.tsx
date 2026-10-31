import React, { useEffect, useState } from "react";
import { Autocomplete, Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiX } from "react-icons/fi";

import * as team from "features/team/styles/teamClasses";

import useUpdateTeamMember from "features/team/hooks/useUpdateTeamMember";
import { isActive, memberRole, roleSuggestions } from "features/team/data";
import { toastOptions } from "features/tasks/data";
import type { TeamMember } from "features/team/types";

interface EditMemberProps {
  /** The member to edit; null when closed */
  member: TeamMember | null;
  onClose: () => void;
  /** Called after the member is saved, to reload the list */
  onSaved: () => void;
}

// Dialog that changes a member's role and whether they are active
const EditMember = ({ member, onClose, onSaved }: EditMemberProps) => {
  const [role, setRole] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updateTeamMember] = useUpdateTeamMember();
  const { enqueueSnackbar } = useSnackbar();

  // Start from the member's current role and status
  useEffect(() => {
    if (member) {
      setRole(memberRole(member));
      setActive(isActive(member));
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      // The backend reads the status as the words "active" / "inactive"
      const resp = await updateTeamMember({
        userid: member!.userid,
        role: role.trim(),
        status: active ? "active" : "inactive",
      });
      enqueueSnackbar(resp.data || "Member updated", { ...toastOptions, variant: "success" });
      onSaved();
      onClose();
    } catch (err) {
      console.log(err);
      enqueueSnackbar("Couldn't update the member. Please try again.", { ...toastOptions, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={Boolean(member)}
      onClose={onClose}
      PaperProps={{ className: team.dialogPaper }}
      aria-labelledby="edit-member-title"
    >
      {member ? (
        <form onSubmit={handleSubmit} noValidate>
          <div className={team.dialogHeader}>
            <div>
              <h2 id="edit-member-title" className={team.dialogTitle}>Edit {member.name}</h2>
              <p className={team.dialogSubtitle}>{member.email}</p>
            </div>
            <button type="button" className={team.iconButton} onClick={onClose} aria-label="Close">
              <FiX />
            </button>
          </div>

          <div className={team.dialogBody}>
            <div className={team.field}>
              <label htmlFor="member-role" className={team.label}>
                Role <span className={team.labelHint}>(optional)</span>
              </label>
              <Autocomplete
                freeSolo
                options={roleSuggestions}
                inputValue={role}
                onInputChange={(event, value) => setRole(value)}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <input
                      {...params.inputProps}
                      id="member-role"
                      className={team.input}
                      placeholder="e.g. Developer"
                    />
                  </div>
                )}
              />
            </div>
            <div className={team.field}>
              <span className={team.label}>Status</span>
              <div role="radiogroup" aria-label="Status" className={team.segmented}>
                {[true, false].map((value) => (
                  <label key={String(value)} className={team.segment}>
                    <input
                      type="radio"
                      name="member-status"
                      checked={active === value}
                      onChange={() => setActive(value)}
                      className="sr-only"
                    />
                    {value ? "Active" : "Inactive"}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className={team.dialogFooter}>
            <button type="button" className={team.btnGhost} onClick={onClose}>Cancel</button>
            <button type="submit" className={team.btnPrimary} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      ) : null}
    </Dialog>
  );
};

export default EditMember;
