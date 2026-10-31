import React, { useState } from "react";
import { Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiX } from "react-icons/fi";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";

import * as note from "features/notes/styles/noteClasses";

import useAddNote from "features/notes/hooks/useAddNote";
import { toastOptions } from "features/tasks/data";
import type { RootState } from "app/store";

type OwnProps = {
  open: boolean;
  onClose: () => void;
  /** Called after the note is saved, to reload the list */
  onCreated: () => void;
  /** The "project" query parameter */
  projectId: string | null;
};

// Dialog that adds a note to the project; notes are private to the user who writes them
const NewNote = ({ open, onClose, onCreated, projectId, currentUser }: OwnProps & Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [createNote] = useAddNote();
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const noteTitle = title.trim();
    if (!noteTitle) {
      setError("Please give the note a title");
      return;
    }

    setSaving(true);
    try {
      const res = await createNote({
        title: noteTitle,
        noteDescription: description.trim(),
        userId: currentUser.id!,
        projectId: projectId!,
      });
      enqueueSnackbar(res.data || "Note added", { ...toastOptions, variant: "success" });
      onCreated();
      handleClose();
    } catch (err) {
      console.log(err);
      enqueueSnackbar("Couldn't save the note. Please try again.", { ...toastOptions, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ className: note.dialogPaper }} aria-labelledby="new-note-title">
      <form onSubmit={handleSubmit} noValidate>
        <div className={note.dialogHeader}>
          <div>
            <h2 id="new-note-title" className={note.dialogTitle}>New note</h2>
            <p className={note.dialogSubtitle}>Only you can see your notes.</p>
          </div>
          <button type="button" className={note.iconButton} onClick={handleClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className={note.dialogBody}>
          <div className={note.field}>
            <label htmlFor="new-note-title-input" className={note.label}>Title</label>
            <input
              id="new-note-title-input"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              className={note.input}
              placeholder="e.g. Release checklist"
              autoComplete="off"
              autoFocus
              aria-invalid={!!error}
              aria-describedby={error ? "new-note-error" : undefined}
            />
            {error ? <p id="new-note-error" className={note.error}>{error}</p> : null}
          </div>
          <div className={note.field}>
            <label htmlFor="new-note-text" className={note.label}>
              Note <span className={note.labelHint}>(optional)</span>
            </label>
            <textarea
              id="new-note-text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={note.textarea}
              placeholder="Write something…"
            />
          </div>
        </div>

        <div className={note.dialogFooter}>
          <button type="button" className={note.btnGhost} onClick={handleClose}>Cancel</button>
          <button type="submit" className={note.btnPrimary} disabled={saving}>
            {saving ? "Saving…" : "Save note"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(NewNote);
