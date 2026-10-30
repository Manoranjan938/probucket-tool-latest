import React from "react";

import "./NotesList.css";

import { BsThreeDots } from "react-icons/bs";
import NotesHeader from "features/notes/components/NotesHeader/NotesHeader";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import type { RootState } from "app/store";

const NotesList = ({ notes }: Props) => {
  const truncate = (string: string, n: number) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  return (
    <>
      <div className="notes_container">
        <NotesHeader />
        <div className="divider" />
        <div className="notes__cards">
          {notes &&
            notes.length > 0 &&
            notes.map((item) => (
              <div className="notes__card" key={item.id}>
                <div className="notes_title">
                  <h2>{item.title}</h2>
                  <span>
                    <BsThreeDots />
                  </span>
                </div>
                <div className="notes__description">
                  <span>{truncate(item.description, 30)}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  notes: state.note.allNotes,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(NotesList);
