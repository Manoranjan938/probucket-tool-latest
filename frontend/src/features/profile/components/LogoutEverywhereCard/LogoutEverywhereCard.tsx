import React, { useState } from "react";
import { Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { connect, type ConnectedProps } from "react-redux";
import { useNavigate } from "react-router-dom";
import { compose } from "redux";

import * as profile from "features/profile/styles/profileClasses";

import { logoutEverywhere } from "features/auth/store/securityActions";
import { toastOptions } from "features/tasks/data";
import { getApiErrorMessage } from "shared/services/apiError";
import type { AppDispatch } from "app/store";

// Ends every session, including this one, so it asks first
const LogoutEverywhereCard = ({ logoutEverywhere }: Props) => {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutEverywhere();
      navigate("/login");
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getApiErrorMessage(err, "Could not log out. Please try again."), {
        ...toastOptions,
        variant: "error",
      });
    }
  };

  return (
    <section className={profile.card} aria-labelledby="logout-everywhere-title">
      <div className={profile.cardHeader}>
        <div>
          <h2 id="logout-everywhere-title" className={profile.cardTitle}>Log out everywhere</h2>
          <p className={profile.cardText}>Log out on all your devices, including this one.</p>
        </div>
      </div>
      <div className={profile.cardBody}>
        <button type="button" className={profile.btnGhost} onClick={() => setConfirming(true)}>
          Log out everywhere
        </button>
      </div>

      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        PaperProps={{ className: profile.dialogPaper }}
        aria-labelledby="logout-everywhere-dialog-title"
        aria-describedby="logout-everywhere-dialog-text"
      >
        <h2 id="logout-everywhere-dialog-title" className={profile.dialogTitle}>Log out on all devices?</h2>
        <p id="logout-everywhere-dialog-text" className={profile.dialogText}>
          You'll need to log in again on every device, including this one.
        </p>
        <div className={profile.dialogFooter}>
          <button type="button" className={profile.btnGhost} onClick={() => setConfirming(false)} disabled={loading}>
            Cancel
          </button>
          <button type="button" className={profile.btnPrimary} onClick={handleLogout} disabled={loading}>
            {loading ? "Logging out…" : "Log out everywhere"}
          </button>
        </div>
      </Dialog>
    </section>
  );
};

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    logoutEverywhere: () => dispatch(logoutEverywhere()),
  };
}

const withConnect = connect(null, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(LogoutEverywhereCard);
