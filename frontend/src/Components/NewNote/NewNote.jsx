import { Button, Modal, Snackbar, TextField } from "@mui/material";
import useAddNote from "hooks/useAddNote";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import MuiAlert from "@mui/material/Alert";

import "./NewNote.css";
import useGetNotesList from "hooks/useGetNotesList";
import { getAllNotes } from "apis/Actions/notesAction";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NewNote = ({
  open,
  handleNoteClose,
  currentProject,
  currentUser,
  setNote,
}) => {
  const [data, setData] = useState({
    title: "",
    description: "",
    showTitle: false,
    showDesc: false,
    message: "",
  });
  const [statusBar, setStatusBar] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    type: "",
    message: "",
  });
  const [noteRequest, setNoteRequest] = useState({
    title: "",
    noteDescription: "",
    userId: "",
    projectId: "",
  });
  const [createNote] = useAddNote();
  const [notes, getNotesList] = useGetNotesList();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setStatusBar({ open: false });
  };

  const handleAdd = (e) => {
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
        userId: currentUser.id,
        projectId: currentProject.projectId,
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
        <div className="new_note_container">
          <div className="new_task_header">
            <h4>Add New Task</h4>
            <i className="fa fa-times-circle-o" onClick={handleNoteClose} />
          </div>
          <div className="divider" />
          <div className="new_task_body">
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
              className="fields"
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
        key={statusBar.vertical + statusBar.horizontal}
      >
        <Alert
          onClose={handleClose}
          severity={statusBar.type}
          sx={{ width: "100%" }}
        >
          {statusBar.message}
        </Alert>
      </Snackbar>
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

export default compose(withConnect)(NewNote);
