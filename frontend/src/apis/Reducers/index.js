import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import securityReducers from "./securityReducers";
import projectReducers from "./projectReducers";
import taskReducers from "./taskReducers";
import teamMembers from "./teamReducers";
import commentReducer from "./commentReducers";
import notesReducers from "./notesReducers";

export default combineReducers({
  error: errorReducer,
  security: securityReducers,
  project: projectReducers,
  tasks: taskReducers,
  teams: teamMembers,
  comment: commentReducer,
  note: notesReducers,
});
