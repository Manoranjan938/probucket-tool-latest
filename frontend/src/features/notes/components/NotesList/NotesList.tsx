import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";

import * as note from "features/notes/styles/noteClasses";

import type { RootState } from "app/store";
import type { NoteListItem } from "features/notes/types";

// The user's notes as cards; clicking a card opens the whole note
const NotesList = ({ notes, onOpen }: { onOpen: (item: NoteListItem) => void } & Props) => {
  return (
    <ul className={note.grid}>
      {notes.map((item) => (
        <li key={item.id}>
          <article className={note.card}>
            <button type="button" className={note.cardButton} onClick={() => onOpen(item)}>
              <h2 className={note.cardTitle}>{item.title}</h2>
              {item.description ? (
                <p className={note.cardText}>{item.description}</p>
              ) : (
                <p className={note.cardTextEmpty}>No text</p>
              )}
            </button>
            {/* Note options (e.g. delete) aren't wired up yet */}
            <button type="button" className={note.cardMenu} aria-label={`Options for ${item.title}`}>
              <FiMoreHorizontal />
            </button>
          </article>
        </li>
      ))}
    </ul>
  );
};

const mapStateToProps = (state: RootState) => ({
  notes: state.note.allNotes,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(NotesList);
