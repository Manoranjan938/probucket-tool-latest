import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import setJWTToken from "features/auth/utils/setJWTToken";
import jwtDecode from "jwt-decode";
import { SET_CURRENT_USER } from "shared/store/types";
import type { JwtUser } from "features/auth/types";
import { logout } from "features/auth/store/securityActions";
import RouteErrorBoundary from "shared/components/RouteErrorBoundary/RouteErrorBoundary";

// Skeletons are shown while a page's code is loading, so they are imported normally
import HomeSkeleton from "features/landing/pages/Home/HomeSkeleton";
import LoginSkeleton from "features/auth/pages/Login/LoginSkeleton";
import LogoutSkeleton from "features/auth/pages/Logout/LogoutSkeleton";
import SignupSkeleton from "features/auth/pages/Signup/SignupSkeleton";
import EmailVerifySkeleton from "features/auth/pages/EmailVerify/EmailVerifySkeleton";
import ForgotSkeleton from "features/auth/pages/Forgot/ForgotSkeleton";
import ResetPasswordSkeleton from "features/auth/pages/ResetPassword/ResetPasswordSkeleton";
import ProjectsSkeleton from "features/projects/pages/Projects/ProjectsSkeleton";
import CreateProjectSkeleton from "features/projects/pages/CreateProject/CreateProjectSkeleton";
import DashboardScreenSkeleton from "features/dashboard/pages/DashboardScreen/DashboardScreenSkeleton";
import TeamDashboardSkeleton from "features/dashboard/pages/TeamDashboard/TeamDashboardSkeleton";
import DashboardHomeSkeleton from "features/dashboard/pages/DashboardHome/DashboardHomeSkeleton";
import TeamDashboardHomeSkeleton from "features/dashboard/pages/TeamDashboardHome/TeamDashboardHomeSkeleton";
import WorksSkeleton from "features/tasks/pages/Works/WorksSkeleton";
import TodosSkeleton from "features/todos/pages/Todos/TodosSkeleton";
import NotesSkeleton from "features/notes/pages/Notes/NotesSkeleton";
import NotificationsSkeleton from "features/notifications/pages/Notifications/NotificationsSkeleton";
import ProjectSettingsSkeleton from "features/projects/pages/ProjectSettings/ProjectSettingsSkeleton";
import TrashSkeleton from "features/trash/pages/Trash/TrashSkeleton";
import NewTeamUserSkeleton from "features/team/pages/NewTeamUser/NewTeamUserSkeleton";
import BugsSkeleton from "features/bugs/pages/Bugs/BugsSkeleton";
import UserProfileSkeleton from "features/profile/pages/UserProfile/UserProfileSkeleton";
import ErrorSkeleton from "shared/pages/Error/ErrorSkeleton";

// Every page is loaded on demand, in its own chunk
const Home = lazy(() => import("features/landing/pages/Home/Home"));
const Login = lazy(() => import("features/auth/pages/Login/Login"));
const Forgot = lazy(() => import("features/auth/pages/Forgot/Forgot"));
const Signup = lazy(() => import("features/auth/pages/Signup/Signup"));
const EmailVerify = lazy(() => import("features/auth/pages/EmailVerify/EmailVerify"));
const Error = lazy(() => import("shared/pages/Error/Error"));
const DashboardScreen = lazy(() => import("features/dashboard/pages/DashboardScreen/DashboardScreen"));
const Logout = lazy(() => import("features/auth/pages/Logout/Logout"));
const CreateProject = lazy(() => import("features/projects/pages/CreateProject/CreateProject"));
const Projects = lazy(() => import("features/projects/pages/Projects/Projects"));
const DashboardHome = lazy(() => import("features/dashboard/pages/DashboardHome/DashboardHome"));
const Works = lazy(() => import("features/tasks/pages/Works/Works"));
const Bugs = lazy(() => import("features/bugs/pages/Bugs/Bugs"));
const Todos = lazy(() => import("features/todos/pages/Todos/Todos"));
const Notes = lazy(() => import("features/notes/pages/Notes/Notes"));
const Notifications = lazy(() => import("features/notifications/pages/Notifications/Notifications"));
const ProjectSettings = lazy(() => import("features/projects/pages/ProjectSettings/ProjectSettings"));
const Trash = lazy(() => import("features/trash/pages/Trash/Trash"));
const UserProfile = lazy(() => import("features/profile/pages/UserProfile/UserProfile"));
const TeamDashboard = lazy(() => import("features/dashboard/pages/TeamDashboard/TeamDashboard"));
const TeamDashboardHome = lazy(() => import("features/dashboard/pages/TeamDashboardHome/TeamDashboardHome"));
const TeamIssue = lazy(() => import("features/bugs/pages/TeamIssue/TeamIssue"));
const NewTeamUser = lazy(() => import("features/team/pages/NewTeamUser/NewTeamUser"));
const ResetPassword = lazy(() => import("features/auth/pages/ResetPassword/ResetPassword"));

const jwtToken: string | undefined = localStorage.jwtToken;

if (jwtToken) {
  setJWTToken(jwtToken);
  const decode = jwtDecode<JwtUser>(jwtToken);
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

// A page inside the personal or team dashboard, with the skeleton shown while its code loads
interface DashboardPage {
  path: string;
  element: ReactNode;
  skeleton: ReactNode;
}

const personalPages: DashboardPage[] = [
  { path: "/home", element: <DashboardHome title="Personal Dashboard" />, skeleton: <DashboardHomeSkeleton /> },
  { path: "/works", element: <Works title="Personal Dashboard" />, skeleton: <WorksSkeleton /> },
  { path: "/todos", element: <Todos title="Personal Dashboard" />, skeleton: <TodosSkeleton /> },
  { path: "/notes", element: <Notes />, skeleton: <NotesSkeleton /> },
  { path: "/notifications", element: <Notifications title="Personal Dashboard" />, skeleton: <NotificationsSkeleton /> },
  { path: "/setting", element: <ProjectSettings />, skeleton: <ProjectSettingsSkeleton /> },
  { path: "/trash", element: <Trash title="Personal Dashboard" />, skeleton: <TrashSkeleton /> },
];

const teamPages: DashboardPage[] = [
  { path: "/home", element: <TeamDashboardHome />, skeleton: <TeamDashboardHomeSkeleton /> },
  { path: "/works", element: <Works title="Team Dashboard" />, skeleton: <WorksSkeleton team /> },
  { path: "/todos", element: <Todos title="Team Dashboard" />, skeleton: <TodosSkeleton /> },
  { path: "/notes", element: <Notes />, skeleton: <NotesSkeleton /> },
  { path: "/notifications", element: <Notifications title="Team Dashboard" />, skeleton: <NotificationsSkeleton /> },
  // TeamIssue renders nothing yet, so there is nothing to show while it loads
  { path: "/issues", element: <TeamIssue />, skeleton: null },
  { path: "/new-user", element: <NewTeamUser />, skeleton: <NewTeamUserSkeleton /> },
  { path: "/setting", element: <ProjectSettings />, skeleton: <ProjectSettingsSkeleton /> },
  { path: "/trash", element: <Trash title="Team Dashboard" />, skeleton: <TrashSkeleton /> },
];

// The dashboard's own routes. Each page has its own Suspense, so the real header and sidebar
// stay on screen while a page loads, and a page that fails to load only replaces the content area.
const renderPages = (pages: DashboardPage[]) => (
  <RouteErrorBoundary variant="content">
    <Routes>
      {pages.map(({ path, element, skeleton }) => (
        <Route key={path} path={path} element={<Suspense fallback={skeleton}>{element}</Suspense>} />
      ))}
    </Routes>
  </RouteErrorBoundary>
);

// The same routes with only the skeletons, shown inside the layout skeleton while the layout itself loads
const renderPageSkeletons = (pages: DashboardPage[]) => (
  <Routes>
    {pages.map(({ path, skeleton }) => (
      <Route key={path} path={path} element={skeleton} />
    ))}
  </Routes>
);

function App() {
  return (
    <Provider store={store}>
      <div className="h-screen">
        <RouteErrorBoundary>
          <Routes>
            <Route path="/" element={<Suspense fallback={<HomeSkeleton />}><Home /></Suspense>} />
            <Route path="/login" element={<Suspense fallback={<LoginSkeleton />}><Login /></Suspense>} />
            <Route path="/logout" element={<Suspense fallback={<LogoutSkeleton />}><Logout /></Suspense>} />
            <Route path="/signup" element={<Suspense fallback={<SignupSkeleton />}><Signup /></Suspense>} />
            <Route path="/verify-email" element={<Suspense fallback={<EmailVerifySkeleton />}><EmailVerify /></Suspense>} />
            <Route path="/resetpassword" element={<Suspense fallback={<ForgotSkeleton />}><Forgot /></Suspense>} />
            <Route path="/reset-passwords" element={<Suspense fallback={<ResetPasswordSkeleton />}><ResetPassword /></Suspense>} />
            <Route path="/projects" element={<Suspense fallback={<ProjectsSkeleton />}><Projects /></Suspense>} />
            <Route path="/create-project" element={<Suspense fallback={<CreateProjectSkeleton />}><CreateProject /></Suspense>} />
            <Route
              path="/project/personal/*"
              element={
                <Suspense
                  fallback={
                    <DashboardScreenSkeleton>
                      {renderPageSkeletons(personalPages)}
                    </DashboardScreenSkeleton>
                  }
                >
                  <DashboardScreen>{renderPages(personalPages)}</DashboardScreen>
                </Suspense>
              }
            />
            <Route
              path="/project/team/*"
              element={
                <Suspense
                  fallback={
                    <TeamDashboardSkeleton>
                      {renderPageSkeletons(teamPages)}
                    </TeamDashboardSkeleton>
                  }
                >
                  <TeamDashboard>{renderPages(teamPages)}</TeamDashboard>
                </Suspense>
              }
            />
            <Route
              path="/bug/user/*"
              element={
                <Suspense fallback={<BugsSkeleton />}>
                  <Bugs>
                    <Routes>
                      <Route path="/home" />
                    </Routes>
                  </Bugs>
                </Suspense>
              }
            />
            <Route path="/people" element={<Suspense fallback={<UserProfileSkeleton />}><UserProfile /></Suspense>} />
            <Route path="*" element={<Suspense fallback={<ErrorSkeleton />}><Error /></Suspense>} />
          </Routes>
        </RouteErrorBoundary>
      </div>
    </Provider>
  );
}

export default App;
