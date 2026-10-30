import React, { useState } from "react";
import image from "shared/assets/images/logo.png";
import MuiAlert, { type AlertProps } from "@mui/material/Alert";
import type { SnackbarState, ApiError } from "shared/types";
import { Snackbar } from "@mui/material";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import { useEffect } from "react";
import useUpdatePassword from "features/profile/hooks/useUpdatePassword";
import type { RootState } from "app/store";
import type { UpdatePasswordRequest } from "features/profile/types";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Profile = ({ user }: Props) => {
  const [password, setPassword] = useState("");
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
  const [passUpdate, setPassUpdate] = useState<UpdatePasswordRequest>({
    userId: "",
    password: "",
  });
  const [updatePassword] = useUpdatePassword();

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
      setError({
        showPassword: false,
        message: "",
      });
      setPassUpdate({
        userId: user.id!,
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
        // TODO(ts-migration): throws inside the catch when there is no response (e.g. network error)
        message: (err as ApiError).response!.data.email,
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

const mapStateToProps = (state: RootState) => ({
  user: state.security.user,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(Profile);
