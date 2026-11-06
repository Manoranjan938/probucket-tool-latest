import { configureStore, type ThunkAction, type UnknownAction } from "@reduxjs/toolkit";
import { api } from "shared/services/api";
import securityReducer from "features/auth/store/securitySlice";
import tasksReducer from "features/tasks/store/tasksSlice";

const store = configureStore({
  reducer: {
    security: securityReducer,
    tasks: tasksReducer,
    // Everything loaded from the backend, see shared/services/api.ts
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, UnknownAction>;

export default store;
