import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as auth from "features/auth/styles/authClasses";
import MuiAlert, { type AlertProps } from "@mui/material/Alert";
import type { SnackbarState, ApiError } from "shared/types";

import image from "shared/assets/images/logo.png";
import googleImage from "shared/assets/images/google-logo.png";
import { Snackbar } from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useSignUpRequest from "features/auth/hooks/useSignUpRequest";
import type { UserRequest } from "features/auth/types";
import { steps } from "features/landing/data";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className={auth.layout}>
      <div className={auth.main}>
        <Link to="/" className={auth.brand}>
          <img src={image} alt="" className={auth.brandLogo} />
          <span className={auth.brandName}>ProBucket</span>
        </Link>

        <div className={auth.content}>
          <h1 className={auth.title}>Create your account</h1>
          <p className={auth.subtitle}>Sign up for your account.</p>

          {/* The form only lets Enter trigger the Continue button's onClick (handleContinue calls preventDefault) */}
          <form noValidate>
            <div className={auth.field}>
              <div className={auth.labelRow}>
                <label htmlFor="signup-email" className={auth.label}>Email</label>
              </div>
              <input
                id="signup-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={auth.input}
                placeholder="Enter email"
                autoComplete="username"
                aria-invalid={validError.showEmail}
              />
              {validError.showEmail ? (
                <p className={auth.error}>{validError.message}</p>
              ) : null}
            </div>

            <div className={auth.field}>
              <div className={auth.labelRow}>
                <label htmlFor="signup-name" className={auth.label}>Full name</label>
              </div>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={auth.input}
                placeholder="Enter full name"
                autoComplete="name"
                aria-invalid={validError.showName}
              />
              {validError.showName ? (
                <p className={auth.error}>{validError.message}</p>
              ) : null}
            </div>

            <div className={auth.field}>
              <div className={auth.labelRow}>
                <label htmlFor="signup-password" className={auth.label}>Password</label>
              </div>
              <div className={auth.inputWrap}>
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={auth.inputPassword}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  aria-invalid={validError.showPassword}
                />
                <button
                  type="button"
                  className={auth.toggle}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {validError.showPassword ? (
                <p className={auth.error}>{validError.message}</p>
              ) : null}
            </div>

            <button type="submit" className={auth.btnPrimary} onClick={handleContinue}>
              Continue
            </button>
          </form>

          <div className={auth.divider}>or</div>

          {/* Has no handler yet – Google sign-in is listed as "Coming soon" on the landing page */}
          <button type="button" className={auth.btnGoogle}>
            <img src={googleImage} alt="" className={auth.btnGoogleLogo} />
            <span>Continue with Google</span>
          </button>

          <div className={auth.footer}>
            <Link to="/login" className={auth.link}>Already have an account? Login</Link>
          </div>
        </div>
      </div>

      <aside className={auth.panel}>
        <div className={auth.panelInner}>
          <span className={auth.panelEyebrow}>How it works</span>
          <h2 className={auth.panelTitle}>Up and running in three steps</h2>
          {/* Same steps as the landing page's "How it works" section */}
          <ol className={auth.panelList}>
            {steps.map((step, index) => (
              <li key={step.title} className={auth.panelItem}>
                <span className={auth.panelIcon}>{index + 1}</span>
                <div>
                  <h3 className={auth.panelItemTitle}>{step.title}</h3>
                  <p className={auth.panelItemText}>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </aside>

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
