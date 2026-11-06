import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Comment, CommentState } from "features/comments/types";

const initialState: CommentState = {
  commentList: [],
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setAllComments: (state, action: PayloadAction<Comment[]>) => {
      state.commentList = action.payload;
    },
  },
});

export const { setAllComments } = commentSlice.actions;

export default commentSlice.reducer;
