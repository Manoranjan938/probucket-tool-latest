import { combineReducers } from "redux";
import errorReducer from "shared/store/errorReducer";
import securityReducers from "features/auth/store/securityReducers";
import projectReducers from "features/projects/store/projectReducers";
import taskReducers from "features/tasks/store/taskReducers";
import teamMembers from "features/team/store/teamReducers";
import commentReducer from "features/comments/store/commentReducers";
import notesReducers from "features/notes/store/notesReducers";

export default combineReducers({
  error: errorReducer,
  security: securityReducers,
  project: projectReducers,
  tasks: taskReducers,
  teams: teamMembers,
  comment: commentReducer,
  note: notesReducers,
});
