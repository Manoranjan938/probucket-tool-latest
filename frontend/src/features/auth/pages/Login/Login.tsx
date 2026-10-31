import React, { useEffect, useState } from "react";
import * as auth from "features/auth/styles/authClasses";

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
import { ImSpinner2 } from "react-icons/im";
import AuthPanel from "features/auth/components/AuthPanel/AuthPanel";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Login = ({getUsers}: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
    }
  };

  const callLoginUser = async () => {
    setLoading(true);
    try{
      const res = await loginRequest(loginRequests);
      if(res.status === 200){
        navigate("/projects");
      }
    }catch(err){
      //console.log(err.response.data.username);
      setPassword("");
      setStatusBar({
        open: true,
        type: "error",
        // TODO(ts-migration): throws inside the catch when there is no response (e.g. network error)
        message: (err as ApiError).response!.data.username,
      });
    }finally{
      setLoading(false);
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
      <div className={auth.layout}>
        <div className={auth.main}>
          <Link to="/" className={auth.brand}>
            <img src={image} alt="" className={auth.brandLogo} />
            <span className={auth.brandName}>ProBucket</span>
          </Link>

          <div className={auth.content}>
            <h1 className={auth.title}>Welcome back</h1>
            <p className={auth.subtitle}>Log in to continue to ProBucket.</p>

            {/* The form only lets Enter trigger the Continue button's onClick (handleSubmit calls preventDefault) */}
            <form noValidate>
              <div className={auth.field}>
                <div className={auth.labelRow}>
                  <label htmlFor="login-email" className={auth.label}>Email</label>
                </div>
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  className={auth.input}
                  placeholder="Enter email"
                  autoComplete="username"
                  disabled={loading}
                  aria-invalid={error.showEmail}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error.showEmail && (
                  <p className={auth.error}>{error.message}</p>
                )}
              </div>

              <div className={auth.field}>
                <div className={auth.labelRow}>
                  <label htmlFor="login-password" className={auth.label}>Password</label>
                  <Link to="/resetpassword" className={auth.link}>Can't login?</Link>
                </div>
                <div className={auth.inputWrap}>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    className={auth.inputPassword}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    disabled={loading}
                    aria-invalid={error.showPassword}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className={auth.toggle}
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {error.showPassword && (
                  <p className={auth.error}>{error.message}</p>
                )}
              </div>

              <button type="submit" className={auth.btnPrimary} disabled={loading} onClick={handleSubmit}>
                {loading ? (
                  <>
                    <ImSpinner2 className={auth.spinner} aria-hidden="true" />
                    Logging in…
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            <div className={auth.divider}>or</div>

            {/* A link can't be disabled, so aria-disabled turns off clicks (see btn in authClasses) and tabIndex takes it out of the tab order */}
            <a
              className={auth.btnGoogle}
              href={GOOGLE_AUTH_URL}
              aria-disabled={loading}
              tabIndex={loading ? -1 : undefined}
            >
              <img src={googleImage} alt="" className={auth.btnGoogleLogo} />
              <span>Continue with Google</span>
            </a>

            <div className={auth.footer}>
              <Link to="/signup" className={auth.link}>Sign up for an account</Link>
            </div>
          </div>
        </div>

        <AuthPanel />

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
