import React, { useState } from "react";
import image from "Images/logo.png";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { connect } from "react-redux";
import { compose } from "redux";
import { useEffect } from "react";
import useUpdatePassword from "hooks/useUpdatePassword";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Profile = ({ user }) => {
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
  const [passUpdate, setPassUpdate] = useState({
    userId: "",
    password: "",
  });
  const [updatePassword] = useUpdatePassword();

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
      setError({
        showPassword: false,
        message: "",
      });
      setPassUpdate({
        userId: user.id,
        password: password,
      });
      setPassword("");
    }
  };

  useEffect(() => {
    if (passUpdate.password && passUpdate.userId) {
      callUpdatePassword();
    }
  }, [passUpdate]);

  const callUpdatePassword = async () => {
    try {
      const resp = await updatePassword(passUpdate);

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

              <button className="login__btn" onClick={handleSubmit}>
                Continue
              </button>
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

const mapStateToProps = (state) => ({
  user: state.security.user,
});

const withConnect = connect(mapStateToProps, null);

export default compose(withConnect)(Profile);
