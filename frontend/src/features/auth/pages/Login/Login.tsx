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

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Login = ({getUsers}: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      <div className="login_container">
        <div className="login__wrapper">
          <div className="login__header">
            <img src={image} alt="" />
            <span>ProBucket</span>
          </div>
          <div className="login__body">
            <div className="login__body__header">
              <span>Login to continue to:</span>
              <h5>Probucket</h5>
            </div>
            <div className="login__body__content">
              <input
                type="text"
                value={email}
                className="input__email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
              {error.showEmail && (
                <div className="error_msg">
                  <span>{error.message}</span>
                </div>
              )}
              <input
                type="password"
                value={password}
                className="input__email"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {error.showPassword && (
                <div className="error_msg">
                  <span>{error.message}</span>
                </div>
              )}

              <button className="login__btn" onClick={handleSubmit}>
                Continue
              </button>
              <span className="login_or">OR</span>
              <a className="login__btn__google" href={GOOGLE_AUTH_URL}>
                <img src={googleImage} alt="" />
                <span>Continue with Google</span>
              </a>
              <hr />
              <div className="links">
                <Link to="/resetpassword">Can't login?</Link>
                <Link to="/signup">Sign up for an account</Link>
              </div>
            </div>
          </div>
        </div>
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
