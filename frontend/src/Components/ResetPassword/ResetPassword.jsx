import React, { useEffect, useState } from "react";
import image from "Images/logo.png";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import useResetPassword from "hooks/useResetPassword";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    showPassword: false,
    message: "",
  });
  const [statusBar, setStatusBar] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    type: "",
    message: "",
  });
  const [resetMyPassword] = useResetPassword();

  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const param = query.get("token");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setStatusBar({ open: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setError({
        showPassword: true,
        message: "**Please fill out this field",
      });
    } else {
      callResetPassword();
      setError({
        showPassword: false,
        message: "",
      });
      setPassword("");
    }
  };

  const callResetPassword = async () => {
    try {
      const resp = await resetMyPassword(param, password);

      if (resp.status === 200) {
        setStatusBar({
          open: true,
          type: "success",
          message: resp.data,
        });
      }
    } catch (err) {
      console.log(err);
      setStatusBar({
        open: true,
        type: "error",
        message: err.response.data.email,
      });
    }
  };

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
              <span>Update your password</span>
              <h5>Probucket</h5>
            </div>
            <div className="login__body__content">
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

              <button className="signin__btn" onClick={handleSubmit}>
                Continue
              </button>
              <hr />
              <div className="signin_links">
                <Link to="/login">Return to login</Link>
              </div>
            </div>
          </div>
        </div>
        <Snackbar
          open={statusBar.open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          key={statusBar.vertical + statusBar.horizontal}
        >
          <Alert
            onClose={handleClose}
            severity={statusBar.type}
            sx={{ width: "100%" }}
          >
            {statusBar.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default ResetPassword;
