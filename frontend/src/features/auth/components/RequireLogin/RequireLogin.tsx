import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import type { RootState } from "app/store";

// The browser deletes the login cookie when it expires, so an ended session looks the same as never having logged in
const RequireLogin = ({ isLoggedIn, children }: Props) =>
  isLoggedIn ? children : <Navigate to="/login" replace />;

const mapStateToProps = (state: RootState) => ({
  isLoggedIn: Boolean(state.security.user && state.security.user.id),
});

const withConnect = connect(mapStateToProps);

type Props = ConnectedProps<typeof withConnect> & { children: ReactNode };

export default compose(withConnect)(RequireLogin);
