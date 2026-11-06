import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";

import * as task from "features/tasks/styles/taskClasses";

import useAddComment from "features/comments/hooks/useAddComment";
import CommentList from "features/comments/components/CommentList/CommentList";
import useGetComments from "features/comments/hooks/useGetComments";
import { toastOptions } from "features/tasks/data";
import { getApiErrorMessage } from "shared/services/apiError";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { setAllComments } from "features/comments/store/commentSlice";

// Comment box and the comments of the open task
const Comments = () => {
  const currentTask = useAppSelector((state) => state.tasks.selectedTask);
  const currentUser = useAppSelector((state) => state.security.user);
  const dispatch = useAppDispatch();
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
    dispatch(setAllComments([]));
  }, []);

  useEffect(() => {
    loadComments();
  }, [currentTask.taskSequence]);

  useEffect(() => {
    dispatch(setAllComments(comments));
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
      enqueueSnackbar(resp.data.message || "Comment added", { ...toastOptions, variant: "success" });
      loadComments();
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, "Couldn't add the comment. Please try again."), { ...toastOptions, variant: "error" });
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

export default Comments;
