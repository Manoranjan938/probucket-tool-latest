import NotesList from "features/notes/components/NotesList/NotesList";
import useGetNotesList from "features/notes/hooks/useGetNotesList";
import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import { getAllNotes } from "features/notes/store/notesAction";
import type { AppDispatch, RootState } from "app/store";
import type { NoteListItem } from "features/notes/types";

const Notes = ({ currentProject, currentUser, setNote }: Props) => {
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

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    setNote: (data: NoteListItem[]) => dispatch(getAllNotes(data)),
  };
}

const mapStateToProps = (state: RootState) => ({
  currentProject: state.project.project,
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(Notes);
