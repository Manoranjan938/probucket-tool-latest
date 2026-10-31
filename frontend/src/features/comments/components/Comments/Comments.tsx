import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";

import * as task from "features/tasks/styles/taskClasses";

import useAddComment from "features/comments/hooks/useAddComment";
import CommentList from "features/comments/components/CommentList/CommentList";
import useGetComments from "features/comments/hooks/useGetComments";
import { setAllComments } from "features/comments/store/commentAction";
import { toastOptions } from "features/tasks/data";
import type { ApiError } from "shared/types";
import type { AppDispatch, RootState } from "app/store";
import type { Comment } from "features/comments/types";

// Comment box and the comments of the open task
const Comments = ({ currentTask, currentUser, setComments }: Props) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [addNewComment] = useAddComment();
  const [comments, getComments] = useGetComments();
  const { enqueueSnackbar } = useSnackbar();

  const loadComments = () => {
    getComments(currentTask.taskSequence).catch((err) => console.log(err));
  };

  useEffect(() => {
    setComments([]);
  }, []);

  useEffect(() => {
    loadComments();
  }, [currentTask.taskSequence]);

  useEffect(() => {
    setComments(comments);
  }, [comments]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = comment.trim();
    if (!text) {
      setError("Write a comment first");
      return;
    }

    setSaving(true);
    try {
      const resp = await addNewComment({
        taskId: currentTask.taskSequence!,
        userId: currentUser.id!,
        comment: text,
      });
      setComment("");
      enqueueSnackbar(resp.data || "Comment added", { ...toastOptions, variant: "success" });
      loadComments();
    } catch (err) {
      const message = (err as ApiError).response?.data?.message;
      enqueueSnackbar(message || "Couldn't add the comment. Please try again.", { ...toastOptions, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <form className={task.comment} onSubmit={handleSubmit} noValidate>
        <span className={task.avatarLarge} aria-hidden="true">
          {currentUser.fullName?.substring(0, 1)}
        </span>
        <div className={`${task.commentBody} flex flex-col gap-2`}>
          <textarea
            rows={2}
            className={`${task.textarea} min-h-[72px]!`}
            placeholder="Add a comment…"
            aria-label="Add a comment"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setError("");
            }}
            aria-invalid={!!error}
            aria-describedby={error ? "comment-error" : undefined}
          />
          {error ? <p id="comment-error" className={task.error}>{error}</p> : null}
          <div className={task.formActions}>
            <button type="submit" className={`${task.btnPrimary} ${task.btnSmall}`} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            {/* Not wired up yet */}
            <button type="button" className={`${task.btnGhost} ${task.btnSmall}`}>Cancel</button>
          </div>
        </div>
      </form>
      <CommentList />
    </div>
  );
};

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    setComments: (data: Comment[]) => dispatch(setAllComments(data)),
  };
}

const mapStateToProps = (state: RootState) => ({
  currentTask: state.tasks.selectedTask,
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(Comments);
