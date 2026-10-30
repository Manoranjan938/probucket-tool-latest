import React, { useState } from "react";
import { Link } from "react-router-dom";

import * as auth from "features/auth/styles/authClasses";
import MuiAlert, { type AlertProps } from '@mui/material/Alert';
import type { SnackbarState, ApiError } from "shared/types";

import image from "shared/assets/images/logo.png";
import { Snackbar } from "@mui/material";

import useResetPassRequest from 'features/auth/hooks/useResetPassRequest';
import AuthPanel from "features/auth/components/AuthPanel/AuthPanel";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Forgot = () => {

  const [email, setEmail] = useState("");
  const [error, setError] = useState({
    show: false,
    message: ''
  })
  const [statusBar, setStatusBar] = useState<SnackbarState>({
    open: false,
    vertical: 'bottom',
    horizontal: 'right',
    type: '',
    message: ''
  });
  const [resetPassword] = useResetPassRequest();

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if(reason === 'clickaway'){
      return;
    }
    setStatusBar({open: false});
  }

  const handleContinue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(!email){
      setError({
        show: true,
        message: '**Please fillout this field'
      })
    }
    else{
      setError({
        show: false,
        message: ''
      })
      callResetPass();
      setEmail('');
      
    }
  }

  const callResetPass = async () => {
    try {
      const res = await resetPassword(email);
      if (res.status === 200) {
        setStatusBar({
          open: true,
          type: "success",
          message: "We sended a reset password link to your email",
        });
      }
    } catch (err) {
      setStatusBar({
        open: true,
        type: "error",
        // TODO(ts-migration): throws inside the catch when there is no response (e.g. network error)
        message: (err as ApiError).response!.data.username,
      });
    }
  };

  return (
    <div className={auth.layout}>
      <div className={auth.main}>
        <Link to="/" className={auth.brand}>
          <img src={image} alt="" className={auth.brandLogo} />
          <span className={auth.brandName}>ProBucket</span>
        </Link>

        <div className={auth.content}>
          <h1 className={auth.title}>Forgot your password?</h1>
          <p className={auth.subtitle}>
            Enter your email and we'll send you a link to reset your password.
          </p>

          {/* The form only lets Enter trigger the Continue button's onClick (handleContinue calls preventDefault) */}
          <form noValidate>
            <div className={auth.field}>
              <div className={auth.labelRow}>
                <label htmlFor="forgot-email" className={auth.label}>Email</label>
              </div>
              <input
                id="forgot-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={auth.input}
                placeholder="Enter email"
                autoComplete="username"
                aria-invalid={error.show}
              />
              {error.show ? (
                <p className={auth.error}>{error.message}</p>
              ) : null}
            </div>

            <button type="submit" className={auth.btnPrimary} onClick={handleContinue}>
              Continue
            </button>
          </form>

          <div className={auth.footer}>
            <Link to="/login" className={auth.link}>Return to login</Link>
          </div>
        </div>
      </div>

      <AuthPanel />

      <Snackbar
        open={statusBar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}
        // TODO(ts-migration): the setStatusBar calls drop vertical/horizontal, so this key changes on the first update and the Snackbar remounts
        key={`${statusBar.vertical}${statusBar.horizontal}`}
      >
        <Alert onClose={handleClose} severity={statusBar.type || undefined} sx={{ width: "100%" }}>
          {statusBar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Forgot;
