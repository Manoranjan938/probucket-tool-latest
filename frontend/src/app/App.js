import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Screens/Home/Home";
import Login from "Screens/Login/Login";
import Forgot from "Screens/ForgotPassword/Forgot";
import Signup from "Screens/Signup/Signup";
import EmailVerify from "Screens/EmailVerify/EmailVerify";
import Error from "Screens/Error/Error";
import DashboardScreen from "Screens/Dashboard/DashboardScreen";
import Logout from "Screens/Logout/Logout";
import CreateProject from "Screens/CreateProject/CreateProject";
import { Provider } from "react-redux";
import store from "./store";
import setJWTToken from "Security/setJWTToken";
import jwtDecode from "jwt-decode";
import { SET_CURRENT_USER } from "apis/Actions/types";
import { logout } from "apis/Actions/securityActions";
import Projects from "Components/Projects/Projects";
import DasboardHome from "Screens/DashboardHome/DasboardHome";
import Works from "Screens/ProjectWorks/Works";
import Bugs from "Screens/BugDashboard/Bugs";
import Todos from "Screens/Todos/Todos";
import Notes from "Screens/Notes/Notes";
import Notifications from "Screens/Notification/Notifications";
import ProjectSettings from "Screens/ProjectSetting/ProjectSetting";
import Trash from "Screens/Trash/Trash";
import UserProfile from "Screens/UserProfile/UserProfile";
import TeamDashboard from "Screens/TeamDashboard/TeamDashboard";
import TeamDashboardHome from "Screens/TeamHome/TeamDashboardHome";
import TeamIssue from "Screens/Issues/TeamIssue";
import NewTeamUser from "Screens/NewUser/NewTeamUser";
import ResetPassword from "Components/ResetPassword/ResetPassword";

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
                    element={<DasboardHome title="Personal Dashboard" />}
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
