import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../Signup/Signin.css";
import MuiAlert from '@mui/material/Alert'

import image from "Images/logo.png";
import { Snackbar } from "@mui/material";

import useResetPassRequest from 'hooks/useResetPassRequest';

const Alert = React.forwardRef(function Alert(props, ref){
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Forgot = () => {

  const [email, setEmail] = useState("");
  const [error, setError] = useState({
    show: false,
    message: ''
  })
  const [statusBar, setStatusBar] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'right',
    type: '',
    message: ''
  });
  const [resetPassword] = useResetPassRequest();

  const handleClose = (event, reason) => {
    if(reason === 'clickaway'){
      return;
    }
    setStatusBar({open: false});
  }

  const handleContinue = (e) => {
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
        message: err.response.data.username,
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
        key={statusBar.vertical + statusBar.horizontal}
      >
        <Alert onClose={handleClose} severity={statusBar.type} sx={{ width: "100%" }}>
          {statusBar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Forgot;
