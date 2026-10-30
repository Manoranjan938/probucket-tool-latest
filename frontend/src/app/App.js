import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "features/landing/pages/Home/Home";
import Login from "features/auth/pages/Login/Login";
import Forgot from "features/auth/pages/Forgot/Forgot";
import Signup from "features/auth/pages/Signup/Signup";
import EmailVerify from "features/auth/pages/EmailVerify/EmailVerify";
import Error from "shared/pages/Error/Error";
import DashboardScreen from "features/dashboard/pages/DashboardScreen/DashboardScreen";
import Logout from "features/auth/pages/Logout/Logout";
import CreateProject from "features/projects/pages/CreateProject/CreateProject";
import { Provider } from "react-redux";
import store from "./store";
import setJWTToken from "features/auth/utils/setJWTToken";
import jwtDecode from "jwt-decode";
import { SET_CURRENT_USER } from "shared/store/types";
import { logout } from "features/auth/store/securityActions";
import Projects from "features/projects/pages/Projects/Projects";
import DashboardHome from "features/dashboard/pages/DashboardHome/DashboardHome";
import Works from "features/tasks/pages/Works/Works";
import Bugs from "features/bugs/pages/Bugs/Bugs";
import Todos from "features/todos/pages/Todos/Todos";
import Notes from "features/notes/pages/Notes/Notes";
import Notifications from "features/notifications/pages/Notifications/Notifications";
import ProjectSettings from "features/projects/pages/ProjectSettings/ProjectSettings";
import Trash from "features/trash/pages/Trash/Trash";
import UserProfile from "features/profile/pages/UserProfile/UserProfile";
import TeamDashboard from "features/dashboard/pages/TeamDashboard/TeamDashboard";
import TeamDashboardHome from "features/dashboard/pages/TeamDashboardHome/TeamDashboardHome";
import TeamIssue from "features/bugs/pages/TeamIssue/TeamIssue";
import NewTeamUser from "features/team/pages/NewTeamUser/NewTeamUser";
import ResetPassword from "features/auth/pages/ResetPassword/ResetPassword";

const jwtToken = localStorage.jwtToken;

if (jwtToken) {
  setJWTToken(jwtToken);
  const decode = jwtDecode(jwtToken);
  store.dispatch({
    type: SET_CURRENT_USER,
    payload: decode,
  });

  const currentTime = Date.now() / 1000;

  if (decode.exp < currentTime) {
    store.dispatch(logout());
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<EmailVerify />} />
          <Route path="/resetpassword" element={<Forgot />} />
          <Route path="/reset-passwords" element={<ResetPassword />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route
            path="/project/personal/*"
            element={
              <DashboardScreen>
                <Routes>
                  <Route
                    path="/home"
                    element={<DashboardHome title="Personal Dashboard" />}
                  />
                  <Route
                    path="/works"
                    element={<Works title="Personal Dashboard" />}
                  />
                  <Route
                    path="/todos"
                    element={<Todos title="Personal Dashboard" />}
                  />
                  <Route path="/notes" element={<Notes />} />
                  <Route
                    path="/notifications"
                    element={<Notifications title="Personal Dashboard" />}
                  />
                  <Route path="/setting" element={<ProjectSettings />} />
                  <Route
                    path="/trash"
                    element={<Trash title="Personal Dashboard" />}
                  />
                </Routes>
              </DashboardScreen>
            }
          />
          <Route
            path="/project/team/*"
            element={
              <TeamDashboard>
                <Routes>
                  <Route path="/home" element={<TeamDashboardHome />} />
                  <Route
                    path="/works"
                    element={<Works title="Team Dashboard" />}
                  />
                  <Route
                    path="/todos"
                    element={<Todos title="Team Dashboard" />}
                  />
                  <Route path="/notes" element={<Notes />} />
                  <Route
                    path="/notifications"
                    element={<Notifications title="Team Dashboard" />}
                  />
                  <Route path="/issues" element={<TeamIssue />} />
                  <Route path="/new-user" element={<NewTeamUser />} />
                  <Route path="/setting" element={<ProjectSettings />} />
                  <Route
                    path="/trash"
                    element={<Trash title="Team Dashboard" />}
                  />
                </Routes>
              </TeamDashboard>
            }
          />
          <Route
            path="/bug/user/*"
            element={
              <Bugs>
                <Routes>
                  <Route path="/home" />
                </Routes>
              </Bugs>
            }
          />
          <Route path="/people" element={<UserProfile />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
