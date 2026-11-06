import React, { useState } from "react";
import { Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import * as profile from "features/profile/styles/profileClasses";

import { toastOptions } from "features/tasks/data";
import { getApiErrorMessage } from "shared/services/apiError";
import { useAppDispatch } from "app/hooks";
import { logoutEverywhere } from "features/auth/store/securitySlice";

// Ends every session, including this one, so it asks first
const LogoutEverywhereCard = () => {
  const dispatch = useAppDispatch();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await dispatch(logoutEverywhere());
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

export default LogoutEverywhereCard;
