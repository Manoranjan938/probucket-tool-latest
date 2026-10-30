import { Button, Modal, Snackbar, TextField } from "@mui/material";
import useAddNote from "features/notes/hooks/useAddNote";
import React, { useEffect, useState } from "react";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import MuiAlert, { type AlertProps } from "@mui/material/Alert";
import type { SnackbarState } from "shared/types";

import { divider, formFieldCompact, modalClose, modalHeader } from "shared/styles/sharedClasses";
import useGetNotesList from "features/notes/hooks/useGetNotesList";
import { getAllNotes } from "features/notes/store/notesAction";
import type { AppDispatch, RootState } from "app/store";
import type { NoteListItem, NotesRequest } from "features/notes/types";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NewNote = ({
  open,
  handleNoteClose,
  currentProject,
  currentUser,
  setNote,
}: { open: boolean; handleNoteClose: () => void } & Props) => {
  const [data, setData] = useState({
    title: "",
    description: "",
    showTitle: false,
    showDesc: false,
    message: "",
  });
  const [statusBar, setStatusBar] = useState<SnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    type: "",
    message: "",
  });
  const [noteRequest, setNoteRequest] = useState<NotesRequest>({
    title: "",
    noteDescription: "",
    userId: "",
    projectId: "",
  });
  const [createNote] = useAddNote();
  const [notes, getNotesList] = useGetNotesList();

  const handleClose = (event: unknown, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setStatusBar({ open: false });
  };

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!data.title && !data.description) {
      setData({
        ...data,
        showTitle: true,
        showDesc: true,
        message: "Please fillout this field",
      });
    } else if (!data.title) {
      setData({
        ...data,
        showTitle: true,
        message: "Please fillout this field",
      });
    } else if (!data.description) {
      setData({
        ...data,
        showDesc: true,
        message: "Please fillout this field",
      });
    } else {
      setNoteRequest({
        title: data.title,
        noteDescription: data.description,
        userId: currentUser.id!,
        projectId: currentProject.projectId!,
      });
      setData({
        ...data,
        title: "",
        description: "",
      });
      handleNoteClose();
    }
  };

  useEffect(() => {
    if (
      noteRequest.title &&
      noteRequest.noteDescription &&
      noteRequest.projectId &&
      noteRequest.userId
    ) {
      callAddNote();
    }
  }, [noteRequest]);

  useEffect(() => {
    setNote(notes);
  }, [notes]);

  const callAddNote = async () => {
    try {
      const res = await createNote(noteRequest);
      if (res.status === 201) {
        setStatusBar({
          open: true,
          type: "success",
          message: res.data,
        });
        getNotesList(currentProject.projectId, currentUser.id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <div className="w-[300px] my-[5%] mx-auto p-4 rounded-[10px] bg-white">
          <div className={modalHeader}>
            <h4 className="m-0">Add New Task</h4>
            <i className={`fa fa-times-circle-o ${modalClose}`} onClick={handleNoteClose} />
          </div>
          <div className={divider} />
          <div>
            <TextField
              id="outlined-basic"
              fullWidth
              label="Add Title"
              variant="outlined"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              error={data.showTitle}
              helperText={data.showTitle && data.message}
            />
            <TextField
              fullWidth
              className={formFieldCompact}
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows={4}
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              error={data.showDesc}
              helperText={data.showDesc && data.message}
            />
            <Button variant="contained" color="primary" onClick={handleAdd}>
              Add
            </Button>
          </div>
        </div>
      </Modal>
      <Snackbar
        open={statusBar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        // TODO(ts-migration): the setStatusBar calls drop vertical/horizontal, so this key changes on the first update and the Snackbar remounts
        key={`${statusBar.vertical}${statusBar.horizontal}`}
      >
        <Alert
          onClose={handleClose}
          severity={statusBar.type || undefined}
          sx={{ width: "100%" }}
        >
          {statusBar.message}
        </Alert>
      </Snackbar>
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

export default compose(withConnect)(NewNote);
