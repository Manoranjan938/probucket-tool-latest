import React from "react";

import * as task from "features/tasks/styles/taskClasses";

import { formatDate } from "features/tasks/data";
import { useAppSelector } from "app/hooks";

const CommentList = () => {
  const comments = useAppSelector((state) => state.comment.commentList);
  if (comments.length === 0) {
    return <p className="text-[14px] text-brand-muted">No comments yet.</p>;
  }

  return (
    <ul className={task.commentList}>
      {comments.map((item) => (
        <li key={item.id} className={task.comment}>
          <span className={task.avatarLarge} aria-hidden="true">
            {item.name.substring(0, 1)}
          </span>
          <div className={task.commentBody}>
            <div className={task.commentMeta}>
              <span className={task.commentAuthor}>{item.name}</span>
              <span className={task.commentDate}>{formatDate(item.commentDate)}</span>
            </div>
            <p className={task.commentText}>{item.comment}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
