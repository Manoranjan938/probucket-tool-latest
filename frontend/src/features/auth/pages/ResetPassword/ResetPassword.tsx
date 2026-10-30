import React, { useEffect, useState } from "react";
import "features/auth/styles/Auth.css";
import image from "shared/assets/images/logo.png";
import MuiAlert, { type AlertProps } from "@mui/material/Alert";
import type { SnackbarState, ApiError } from "shared/types";
import { Snackbar } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import useResetPassword from "features/auth/hooks/useResetPassword";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthPanel from "features/auth/components/AuthPanel/AuthPanel";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    showPassword: false,
    message: "",
  });
  const [statusBar, setStatusBar] = useState<SnackbarState>({
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

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setStatusBar({ open: false });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        // TODO(ts-migration): throws inside the catch when there is no response (e.g. network error)
        message: (err as ApiError).response!.data.email,
      });
    }
  };

  return (
    <>
      <div className="auth">
        <div className="auth__main">
          <Link to="/" className="auth__brand">
            <img src={image} alt="" />
            <span>ProBucket</span>
          </Link>

          <div className="auth__content">
            <h1 className="auth__title">Set a new password</h1>
            <p className="auth__subtitle">Choose a new password for your ProBucket account.</p>

            {/* The form only lets Enter trigger the Continue button's onClick (handleSubmit calls preventDefault) */}
            <form noValidate>
              <div className="auth__field">
                <div className="auth__label__row">
                  <label htmlFor="reset-password" className="auth__label">New password</label>
                </div>
                <div className="auth__input__wrap">
                  <input
                    id="reset-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    className="auth__input auth__input--password"
                    placeholder="Enter password"
                    autoComplete="new-password"
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

            <div className="auth__footer">
              <Link to="/login">Return to login</Link>
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

export default ResetPassword;
