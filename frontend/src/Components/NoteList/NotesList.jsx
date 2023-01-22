import React from "react";

import "./NotesList.css";

import { BsThreeDots } from "react-icons/bs";
import NotesHeader from "Components/NotesHeader/NotesHeader";
import { connect } from "react-redux";
import { compose } from "redux";

const NotesList = ({ notes }) => {
  const truncate = (string, n) => {
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

const mapStateToProps = (state) => ({
  notes: state.note.allNotes,
});

const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(NotesList);
