import React, { useState } from "react";
import Helmet from "react-helmet";
import { useLocation } from "react-router-dom";
import { FiFileText, FiPlus } from "react-icons/fi";

import * as note from "features/notes/styles/noteClasses";

import NotesHeader from "features/notes/components/NotesHeader/NotesHeader";
import NotesList from "features/notes/components/NotesList/NotesList";
import NewNote from "features/notes/components/NewNote/NewNote";
import NoteDetails from "features/notes/components/NoteDetails/NoteDetails";
import { NoteCardsSkeleton } from "features/notes/pages/Notes/NotesSkeleton";
import useProjectNotes from "features/notes/hooks/useProjectNotes";
import type { NoteListItem } from "features/notes/types";

const Notes = () => {
  // Shown as empty if they couldn't be loaded; adding a note reloads them
  const { data: myNotes = [], isLoading } = useProjectNotes();
  const [showNewNote, setShowNewNote] = useState(false);
  const [openNote, setOpenNote] = useState<NoteListItem | null>(null);

  const { pathname, search } = useLocation();
  const projectId = new URLSearchParams(search).get("project");
  const title = pathname.startsWith("/project/team/") ? "Team Dashboard" : "Personal Dashboard";

  return (
    <div className={note.page}>
      <Helmet>
        <title>{title} | Notes</title>
      </Helmet>

      <NotesHeader onNewNote={() => setShowNewNote(true)} />

      {isLoading ? (
        <NoteCardsSkeleton />
      ) : myNotes.length > 0 ? (
        <NotesList onOpen={setOpenNote} />
      ) : (
        <div className={note.empty}>
          <span className={note.emptyIcon} aria-hidden="true">
            <FiFileText />
          </span>
          <h2 className={note.emptyTitle}>No notes yet</h2>
          <p className={note.emptyText}>
            Keep ideas, meeting notes and checklists for this project here. Only you can see your notes.
          </p>
          <button type="button" className={note.btnPrimary} onClick={() => setShowNewNote(true)}>
            <FiPlus aria-hidden="true" />
            New note
          </button>
        </div>
      )}

      <NewNote
        open={showNewNote}
        onClose={() => setShowNewNote(false)}
        projectId={projectId}
      />
      <NoteDetails item={openNote} onClose={() => setOpenNote(null)} />
    </div>
  );
};

export default Notes;
