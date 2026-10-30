import React, { useState } from "react";
import { Link } from "react-router-dom";

import "features/auth/pages/Signup/Signup.css";
import MuiAlert, { type AlertProps } from '@mui/material/Alert';
import type { SnackbarState, ApiError } from "shared/types";

import image from "shared/assets/images/logo.png";
import { Snackbar } from "@mui/material";

import useResetPassRequest from 'features/auth/hooks/useResetPassRequest';

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
    <div className="signin_container">
      <div className="signin__wrapper">
        <div className="signin__header">
          <img src={image} alt="" />
          <span>ProBucket</span>
        </div>
        <div className="signin__body">
          <div className="signin__body__header">
            <span>Can't login or forgot password</span>
          </div>
          <div className="signin__body__content">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input__email"
              placeholder="Enter email"
            />
            {error.show ? (
              <div className="error_msg">
                <span>{error.message}</span>
              </div>
            ) : null}

            <button className="signin__btn" onClick={handleContinue}>Continue</button>
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
