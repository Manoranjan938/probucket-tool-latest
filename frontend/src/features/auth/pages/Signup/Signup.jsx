import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Signin.css";
import MuiAlert from "@mui/material/Alert";

import image from "Images/logo.png";
import { Snackbar } from "@mui/material";
import useSignUpRequest from "hooks/useSignUpRequest";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Signup = ({ addUser }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [validError, setValidError] = useState({
    showEmail: false,
    showName: false,
    showPassword: false,
    message: "",
  });
  const [notiBar, setNotiBar] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    type: "",
    message: "",
  });

  const [registerRequest, setRegisterRequest] = useState({
    username: "",
    password: "",
    name: "",
    roleName: "",
  });
  const [register] = useSignUpRequest();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotiBar({ open: false });
  };

  const handleContinue = (e) => {
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
        message: err.response.data.message,
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
        key={notiBar.vertical + notiBar.horizontal}
      >
        <Alert
          onClose={handleClose}
          severity={notiBar.type}
          sx={{ width: "100%" }}
        >
          {notiBar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signup;
