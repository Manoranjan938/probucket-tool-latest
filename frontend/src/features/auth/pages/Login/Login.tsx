import React, { useEffect, useState } from "react";
import "./Login.css";

import image from "shared/assets/images/logo.png";
import googleImage from "shared/assets/images/google-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { GOOGLE_AUTH_URL } from "shared/constants/constant";
import MuiAlert, { type AlertProps } from '@mui/material/Alert';
import type { SnackbarState, ApiError } from "shared/types";
import { Snackbar } from "@mui/material";
import { login } from "features/auth/store/securityActions";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import useLoginRequest from "features/auth/hooks/useLoginRequest";
import type { AppDispatch, RootState } from "app/store";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { features } from "features/landing/data";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Login = ({getUsers}: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    showEmail: false,
    showPassword: false,
    message: ''
  })
  const [statusBar, setStatusBar] = useState<SnackbarState>({
    open: false,
    vertical: 'bottom',
    horizontal: 'right',
    type: '',
    message: ''
  });
  const [loginRequests, setLoginRequest] = useState({
    username: "",
    password: "",
  });
  const [tokens, loginRequest] = useLoginRequest();

  const navigate = useNavigate();

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if(reason === 'clickaway'){
      return;
    }
    setStatusBar({open: false});
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(!email && !password){
      setError({
        showEmail: true,
        showPassword: true,
        message: '**Please fill out this field'
      })
    }
    else if(!email){
      setError({
        showEmail: true,
        showPassword: false,
        message: '**Please fill out this field'
      })
    }
    else if(!password){
      setError({
        showEmail: false,
        showPassword: true,
        message: '**Please fill out this field'
      })
    }
    else{
      setError({
        showEmail: false,
        showPassword: false,
        message: ''
      })
      setLoginRequest({
        username: email,
        password: password,
      });
      setEmail("");
      setPassword("")
    }
  };

  const callLoginUser = async () => {
    try{
      const res = await loginRequest(loginRequests);
      if(res.status === 200){
        navigate("/projects");
      }
    }catch(err){
      //console.log(err.response.data.username);
      setStatusBar({
        open: true,
        type: "error",
        // TODO(ts-migration): throws inside the catch when there is no response (e.g. network error)
        message: (err as ApiError).response!.data.username,
      });
    }
  }

  useEffect(() => {
    if (loginRequests.username && loginRequests.password) {
      callLoginUser();
    }
  }, [loginRequests]);

  useEffect(() => {
    getUsers(tokens);
  }, [tokens]);

  useEffect(() => {

    if (localStorage.getItem("jwtToken")) {
      navigate("/projects");
    }else{
      navigate("/login")
    }
  }, []);

  return (
    <>
      <div className="auth">
        <div className="auth__main">
          <Link to="/" className="auth__brand">
            <img src={image} alt="" />
            <span>ProBucket</span>
          </Link>

          <div className="auth__content">
            <h1 className="auth__title">Welcome back</h1>
            <p className="auth__subtitle">Log in to continue to ProBucket.</p>

            {/* The form only lets Enter trigger the Continue button's onClick (handleSubmit calls preventDefault) */}
            <form noValidate>
              <div className="auth__field">
                <div className="auth__label__row">
                  <label htmlFor="login-email" className="auth__label">Email</label>
                </div>
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  className="auth__input"
                  placeholder="Enter email"
                  autoComplete="username"
                  aria-invalid={error.showEmail}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error.showEmail && (
                  <p className="auth__error">{error.message}</p>
                )}
              </div>

              <div className="auth__field">
                <div className="auth__label__row">
                  <label htmlFor="login-password" className="auth__label">Password</label>
                  <Link to="/resetpassword">Can't login?</Link>
                </div>
                <div className="auth__input__wrap">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    className="auth__input auth__input--password"
                    placeholder="Enter password"
                    autoComplete="current-password"
                    aria-invalid={error.showPassword}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="auth__toggle"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {error.showPassword && (
                  <p className="auth__error">{error.message}</p>
                )}
              </div>

              <button type="submit" className="auth__btn auth__btn--primary" onClick={handleSubmit}>
                Continue
              </button>
            </form>

            <div className="auth__divider">or</div>

            <a className="auth__btn auth__btn--google" href={GOOGLE_AUTH_URL}>
              <img src={googleImage} alt="" />
              <span>Continue with Google</span>
            </a>

            <div className="auth__footer">
              <Link to="/signup">Sign up for an account</Link>
            </div>
          </div>
        </div>

        <aside className="auth__panel">
          <div className="auth__panel__inner">
            <h2 className="auth__panel__title">Plan, track and ship your projects in one place.</h2>
            <p className="auth__panel__text">
              ProBucket brings your projects, tasks and team together.
            </p>
            <ul className="auth__panel__list">
              {/* Task board, Priorities & assignees and Subtasks – same copy as the landing page */}
              {features.slice(1, 4).map((feature) => (
                <li key={feature.title}>
                  <span className="auth__panel__icon">
                    <feature.icon />
                  </span>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <Snackbar
          open={statusBar.open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          // TODO(ts-migration): the setStatusBar calls drop vertical/horizontal, so this key changes on the first update and the Snackbar remounts
          key={`${statusBar.vertical}${statusBar.horizontal}`}
        >
          <Alert
            onClose={handleClose}
            severity={statusBar.type || undefined}
            sx={{ width: "100%" }}
          >
            {statusBar.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getUsers: (data: string) => dispatch(login(data)),
  };
}

const mapStateToProps = (state: RootState) => ({
  security: state.security,
});

const withConnect = connect(null, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(Login);
