import { Avatar, Button, Snackbar } from "@mui/material";
import React, { useState, useEffect } from "react";

import "./Comments.css";

import { connect } from "react-redux";
import { compose } from "redux";
import useAddComment from "hooks/useAddComment";
import MuiAlert from "@mui/material/Alert";
import CommentList from "Components/CommentList/CommentList";
import useGetComments from "hooks/useGetComments";
import { setAllComments } from "apis/Actions/commentAction";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Comments = ({ currentTask, currentUser, setComments }) => {
  const [comment, setComment] = useState("");
  const [commentRequest, setCommentRequest] = useState({
    taskId: "",
    userId: "",
    comment: "",
  });
  const [addNewComment] = useAddComment();
  const [statusBar, setStatusBar] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    type: "",
    message: "",
  });
  const [comments, getComments] = useGetComments();

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment) {
      alert("Please add some comment");
    } else {
      setCommentRequest({
        taskId: currentTask.taskSequence,
        userId: currentUser.id,
        comment: comment,
      });
      setComment("");
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setStatusBar({ open: false });
  };

  useEffect(() => {
    setComments([]);
  }, []);

  useEffect(() => {
    if (
      commentRequest.taskId &&
      commentRequest.userId &&
      commentRequest.comment
    ) {
      callAddComment();
    }
  }, [commentRequest]);

  const callAddComment = async () => {
    try {
      const resp = await addNewComment(commentRequest);
      if (resp.status === 201) {
        setStatusBar({
          open: true,
          type: "success",
          message: resp.data,
        });
        getComments(currentTask.taskSequence);
      }
    } catch (err) {
      setStatusBar({
        open: true,
        type: "error",
        message: err.response.data.message,
      });
    }
  };

  useEffect(() => {
    getComments(currentTask.taskSequence);
  }, [currentTask.taskSequence]);

  useEffect(() => {
    setComments(comments);
  }, [comments]);

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}`,
    };
  }

  return (
    <>
      <div className="comments_container">
        <div className="user_avatar">
          <Avatar {...stringAvatar(currentUser.fullName)} />
        </div>
        <div className="comments">
          <div className="comment-text-field">
            <input
              type="text"
              name=""
              id=""
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="comment__btns">
            <Button variant="contained" color="primary" onClick={handleComment}>
              Save
            </Button>
            <Button variant="contained" color="inherit">
              Cancel
            </Button>
          </div>
        </div>
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
      </div>
      <CommentList />
    </>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    setComments: (data) => dispatch(setAllComments(data)),
  };
}

const mapStateToProps = (state) => ({
  currentTask: state.tasks.selectedTask,
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Comments);
