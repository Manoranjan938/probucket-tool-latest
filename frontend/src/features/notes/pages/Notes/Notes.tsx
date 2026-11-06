import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useLocation } from "react-router-dom";
import { FiFileText, FiPlus } from "react-icons/fi";

import * as note from "features/notes/styles/noteClasses";

import NotesHeader from "features/notes/components/NotesHeader/NotesHeader";
import NotesList from "features/notes/components/NotesList/NotesList";
import NewNote from "features/notes/components/NewNote/NewNote";
import NoteDetails from "features/notes/components/NoteDetails/NoteDetails";
import { NoteCardsSkeleton } from "features/notes/pages/Notes/NotesSkeleton";
import useGetNotesList from "features/notes/hooks/useGetNotesList";
import type { NoteListItem } from "features/notes/types";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { setAllNotes } from "features/notes/store/noteSlice";

const Notes = () => {
  const currentUser = useAppSelector((state) => state.security.user);
  const myNotes = useAppSelector((state) => state.note.allNotes);
  const dispatch = useAppDispatch();
  const [, getNotesList] = useGetNotesList();
  const [loading, setLoading] = useState(true);
  const [showNewNote, setShowNewNote] = useState(false);
  const [openNote, setOpenNote] = useState<NoteListItem | null>(null);

  const { pathname, search } = useLocation();
  const projectId = new URLSearchParams(search).get("project");
  const title = pathname.startsWith("/project/team/") ? "Team Dashboard" : "Personal Dashboard";

  const loadNotes = async () => {
    try {
      const resp = await getNotesList(projectId, currentUser.id);
      dispatch(setAllNotes(resp.data.data));
    } catch (err) {
      console.log(err);
      dispatch(setAllNotes([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className={note.page}>
      <Helmet>
        <title>{title} | Notes</title>
      </Helmet>

      <NotesHeader onNewNote={() => setShowNewNote(true)} />

      {loading ? (
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
        onCreated={loadNotes}
        projectId={projectId}
      />
      <NoteDetails item={openNote} onClose={() => setOpenNote(null)} />
    </div>
  );
};

export default Notes;
