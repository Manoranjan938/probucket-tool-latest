import NotesList from "features/notes/components/NotesList/NotesList";
import useGetNotesList from "features/notes/hooks/useGetNotesList";
import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { compose } from "redux";
import { getAllNotes } from "features/notes/store/notesAction";

const Notes = ({ currentProject, currentUser, setNote }) => {
  const [notes, getNotesList] = useGetNotesList();

  useEffect(() => {
    getNotesList(currentProject.projectId, currentUser.id);
  }, []);

  useEffect(() => {
    setNote(notes);
  }, [notes]);

  return (
    <>
      <Helmet>
        <title>Team Dashboard | Notes</title>
      </Helmet>
      <NotesList />
    </>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    setNote: (data) => dispatch(getAllNotes(data)),
  };
}

const mapStateToProps = (state) => ({
  currentProject: state.project.project,
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Notes);
