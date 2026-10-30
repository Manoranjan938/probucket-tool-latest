/** model/response/CommentsList.java */
export interface Comment {
  name: string;
  id: number;
  comment: string;
  commentDate: string;
}

/** model/request/CommentRequest.java */
export interface CommentRequest {
  taskId: string;
  userId: string;
  comment: string;
}

export interface CommentState {
  commentList: Comment[];
}
