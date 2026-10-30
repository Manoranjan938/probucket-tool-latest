import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";
import MuiAlert, { type AlertProps } from "@mui/material/Alert";
import type { SnackbarState, ApiError } from "shared/types";

import image from "shared/assets/images/logo.png";
import { Snackbar } from "@mui/material";
import useSignUpRequest from "features/auth/hooks/useSignUpRequest";
import type { UserRequest } from "features/auth/types";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [validError, setValidError] = useState<{
    showEmail: boolean;
    showName: boolean;
    showPassword?: boolean;
    message: string;
  }>({
    showEmail: false,
    showName: false,
    showPassword: false,
    message: "",
  });
  const [notiBar, setNotiBar] = useState<SnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    type: "",
    message: "",
  });

  const [registerRequest, setRegisterRequest] = useState<UserRequest>({
    username: "",
    password: "",
    name: "",
    roleName: "",
  });
  const [register] = useSignUpRequest();

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setNotiBar({ open: false });
  };

  const handleContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!email && !name && !password) {
      setValidError({
        showEmail: true,
        showName: true,
        showPassword: true,
        message: "**Please fillout this field",
      });
    } else if (!email) {
      setValidError({
        showEmail: true,
        showName: false,
        showPassword: false,
        message: "**Please fillout this field",
      });
    } else if (!name) {
      setValidError({
        showEmail: false,
        showName: true,
        showPassword: false,
        message: "**Please fillout this field",
      });
    } else if (!password) {
      setValidError({
        showEmail: false,
        showName: false,
        showPassword: true,
        message: "**Please fillout this field",
      });
    } else {
      setValidError({
        showEmail: false,
        showName: false,
        message: "",
      });
      setRegisterRequest({
        username: email,
        password: password,
        name: name,
        roleName: "ROLE_USER",
      });

      setEmail("");
      setName("");
      setPassword("");
    }
  };

  const callAddUser = async () => {
    try {
      const res = await register(registerRequest);
      if (res.status === 201) {
        setNotiBar({
          open: true,
          type: "success",
          message: "You have registered successfully",
        });
      }
    } catch (err) {
      //console.log(err.response);
      setNotiBar({
        open: true,
        type: "error",
        // TODO(ts-migration): throws inside the catch when there is no response (e.g. network error)
        message: (err as ApiError).response!.data.message,
      });
    }
  };

  useEffect(() => {
    if (
      registerRequest.username &&
      registerRequest.password &&
      registerRequest.name
    ) {
      callAddUser();
    }
  }, [registerRequest]);

  return (
    <div className="signin_container">
      <div className="signin__wrapper">
        <div className="signin__header">
          <img src={image} alt="" />
          <span>ProBucket</span>
        </div>
        <div className="signin__body">
          <div className="signin__body__header">
            <span>Sign up for your account</span>
          </div>
          <div className="signin__body__content">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input__email"
              placeholder="Enter email"
            />

            {validError.showEmail ? (
              <div className="error_msg">
                <span>{validError.message}</span>
              </div>
            ) : null}

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input__email"
              placeholder="Enter full name"
            />

            {validError.showName ? (
              <div className="error_msg">
                <span>{validError.message}</span>
              </div>
            ) : null}

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input__email"
              placeholder="Enter password"
            />

            {validError.showPassword ? (
              <div className="error_msg">
                <span>{validError.message}</span>
              </div>
            ) : null}

            <button className="signin__btn" onClick={handleContinue}>
              Continue
            </button>
            <span className="signin_or">OR</span>
            <button className="signin__btn__google">
              Continue with Google
            </button>
            <hr />
            <div className="signin_links">
              <Link to="/login">Already have an account? Login</Link>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={notiBar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        // TODO(ts-migration): the setNotiBar calls drop vertical/horizontal, so this key changes on the first update and the Snackbar remounts
        key={`${notiBar.vertical}${notiBar.horizontal}`}
      >
        <Alert
          onClose={handleClose}
          severity={notiBar.type || undefined}
          sx={{ width: "100%" }}
        >
          {notiBar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signup;
