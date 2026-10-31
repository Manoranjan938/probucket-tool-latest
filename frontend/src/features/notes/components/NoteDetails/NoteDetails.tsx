import React from "react";
import { Dialog } from "@mui/material";
import { FiX } from "react-icons/fi";

import * as note from "features/notes/styles/noteClasses";

import type { NoteListItem } from "features/notes/types";

interface NoteDetailsProps {
  /** The note to show; null when closed */
  item: NoteListItem | null;
  onClose: () => void;
}

// Read-only dialog with the whole note (the backend has no endpoint to edit a note)
const NoteDetails = ({ item, onClose }: NoteDetailsProps) => {
  return (
    <Dialog open={Boolean(item)} onClose={onClose} PaperProps={{ className: note.dialogPaper }} aria-labelledby="note-title">
      {item ? (
        <>
          <div className={note.dialogHeader}>
            <h2 id="note-title" className={note.dialogTitle}>{item.title}</h2>
            <button type="button" className={note.iconButton} onClick={onClose} aria-label="Close">
              <FiX />
            </button>
          </div>
          <div className={note.dialogBody}>
            {item.description ? (
              <p className={note.noteText}>{item.description}</p>
            ) : (
              <p className={note.cardTextEmpty}>This note has no text.</p>
            )}
          </div>
          <div className={note.dialogFooter}>
            <button type="button" className={note.btnGhost} onClick={onClose}>Close</button>
          </div>
        </>
      ) : null}
    </Dialog>
  );
};

export default NoteDetails;
