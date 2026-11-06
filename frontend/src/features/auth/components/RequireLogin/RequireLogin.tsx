import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "app/hooks";
import { selectIsLoggedIn } from "features/auth/store/securitySlice";

// The browser deletes the login cookie when it expires, so an ended session looks the same as never having logged in
const RequireLogin = ({ children }: { children: ReactNode }) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default RequireLogin;
