import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { FiEye, FiEyeOff } from "react-icons/fi";

import * as profile from "features/profile/styles/profileClasses";

import { useUpdatePasswordMutation } from "features/profile/api/profileApi";
import { MIN_PASSWORD_LENGTH } from "features/profile/data";
import { toastOptions } from "features/tasks/data";
import { getApiErrorMessage } from "shared/services/apiError";

const noErrors = { password: "", confirm: "" };

// TODO(profile-backend): ask for the current password – see features/profile/BACKEND_TODO.md
const ChangePasswordCard = ({ userId }: { userId: string | undefined }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState(noErrors);
  const [saving, setSaving] = useState(false);
  const [updatePassword] = useUpdatePasswordMutation();
  const { enqueueSnackbar } = useSnackbar();

  const validate = () => {
    if (!password) {
      return { ...noErrors, password: "Enter a new password." };
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return { ...noErrors, password: `Use at least ${MIN_PASSWORD_LENGTH} characters.` };
    }
    if (password !== confirm) {
      return { ...noErrors, confirm: "The passwords don't match." };
    }
    return noErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (found.password || found.confirm) {
      return;
    }
    setSaving(true);
    try {
      await updatePassword({ userId: userId!, password }).unwrap();
      setPassword("");
      setConfirm("");
      setShowPassword(false);
      enqueueSnackbar("Password updated", { ...toastOptions, variant: "success" });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, "Couldn't update the password. Please try again."), {
        ...toastOptions,
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={profile.card} aria-labelledby="change-password-title">
      <div className={profile.cardHeader}>
        <div>
          <h2 id="change-password-title" className={profile.cardTitle}>Change password</h2>
          <p className={profile.cardText}>Your other devices will be logged out. This one stays logged in.</p>
        </div>
      </div>
      <div className={profile.cardBody}>
        <form className={profile.form} onSubmit={handleSubmit} noValidate>
          <div className={profile.field}>
            <label htmlFor="new-password" className={profile.label}>New password</label>
            <div className={profile.inputWrap}>
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                className={profile.inputPassword}
                autoComplete="new-password"
                disabled={saving}
                aria-invalid={Boolean(errors.password)}
                aria-describedby="new-password-note"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={profile.toggle}
                aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password ? (
              <p id="new-password-note" className={profile.error}>{errors.password}</p>
            ) : (
              <p id="new-password-note" className={profile.hint}>At least {MIN_PASSWORD_LENGTH} characters.</p>
            )}
          </div>
          <div className={profile.field}>
            <label htmlFor="confirm-password" className={profile.label}>Confirm new password</label>
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirm}
              className={profile.input}
              autoComplete="new-password"
              disabled={saving}
              aria-invalid={Boolean(errors.confirm)}
              aria-describedby={errors.confirm ? "confirm-password-error" : undefined}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {errors.confirm ? (
              <p id="confirm-password-error" className={profile.error}>{errors.confirm}</p>
            ) : null}
          </div>
          <div className={profile.formActions}>
            <button type="submit" className={profile.btnPrimary} disabled={saving}>
              {saving ? "Saving…" : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ChangePasswordCard;
