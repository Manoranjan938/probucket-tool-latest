import { configureStore, type ThunkAction, type UnknownAction } from "@reduxjs/toolkit";
import securityReducer from "features/auth/store/securitySlice";
import projectReducer from "features/projects/store/projectSlice";
import tasksReducer from "features/tasks/store/tasksSlice";
import teamsReducer from "features/team/store/teamsSlice";
import commentReducer from "features/comments/store/commentSlice";
import noteReducer from "features/notes/store/noteSlice";

const store = configureStore({
  reducer: {
    security: securityReducer,
    project: projectReducer,
    tasks: tasksReducer,
    teams: teamsReducer,
    comment: commentReducer,
    note: noteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, UnknownAction>;

export default store;
