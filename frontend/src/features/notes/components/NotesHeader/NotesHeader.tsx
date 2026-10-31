import React from "react";
import { FiPlus, FiSearch } from "react-icons/fi";

import * as note from "features/notes/styles/noteClasses";

// Toolbar of the Notes page: search and "New note"
const NotesHeader = ({ onNewNote }: { onNewNote: () => void }) => {
  return (
    <div className={note.toolbar}>
      {/* Not wired up yet – kept so the toolbar looks complete */}
      <label className={note.search}>
        <FiSearch aria-hidden="true" />
        <input type="search" placeholder="Search notes" aria-label="Search notes" className={note.searchInput} />
      </label>
      <button type="button" className={`${note.btnPrimary} ml-auto`} onClick={onNewNote}>
        <FiPlus aria-hidden="true" />
        New note
      </button>
    </div>
  );
};

export default NotesHeader;
