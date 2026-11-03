import React from "react";
import { FiActivity, FiCheckSquare, FiSun } from "react-icons/fi";

import * as profile from "features/profile/styles/profileClasses";

import ComingSoonBadge from "features/profile/components/ComingSoonBadge/ComingSoonBadge";
import ComingSoonCard from "features/profile/components/ComingSoonCard/ComingSoonCard";
import { roleLabels } from "features/profile/data";
import type { AuthUser } from "features/auth/types";

// The Profile tab: what is known about the user, read-only until the backend can save it
// TODO(profile-backend): every "Coming soon" here is listed in features/profile/BACKEND_TODO.md
const ProfileTab = ({ user }: { user: Partial<AuthUser> }) => {
  return (
    <>
      <section className={profile.card} aria-labelledby="profile-details-title">
        <div className={profile.cardHeader}>
          <div>
            <h2 id="profile-details-title" className={profile.cardTitle}>Personal details</h2>
            <p className={profile.cardText}>How you appear in ProBucket.</p>
          </div>
          <ComingSoonBadge label="Editing coming soon" />
        </div>
        <dl className={profile.detailList}>
          <div className={profile.detailRow}>
            <dt className={profile.detailLabel}>Full name</dt>
            <dd className={profile.detailValue}>
              <span className={profile.detailText}>{user.fullName}</span>
            </dd>
          </div>
          <div className={profile.detailRow}>
            <dt className={profile.detailLabel}>Email</dt>
            <dd className={profile.detailValue}>
              <span className={profile.detailText} title={user.username}>{user.username}</span>
            </dd>
          </div>
          <div className={profile.detailRow}>
            <dt className={profile.detailLabel}>Phone</dt>
            <dd className={profile.detailValue}>
              <span className={profile.detailEmpty}>–</span>
            </dd>
          </div>
          <div className={profile.detailRow}>
            <dt className={profile.detailLabel}>Role</dt>
            <dd className={profile.detailValue}>
              <span className={profile.detailText}>{roleLabels[user.rolename ?? ""] ?? "–"}</span>
            </dd>
          </div>
        </dl>
      </section>

      <section className={profile.card} aria-labelledby="profile-photo-title">
        <div className={profile.cardHeader}>
          <div>
            <h2 id="profile-photo-title" className={profile.cardTitle}>Profile photo</h2>
            <p className={profile.cardText}>Your initial is used as your avatar for now.</p>
          </div>
          <ComingSoonBadge />
        </div>
        <div className={profile.cardBody}>
          <div className={profile.photoRow}>
            <span className={profile.photoAvatar} aria-hidden="true">
              {user.fullName?.substring(0, 1)}
            </span>
            <button type="button" className={profile.btnGhost} disabled>Upload photo</button>
          </div>
        </div>
      </section>

      <section className={profile.card} aria-labelledby="profile-about-title">
        <div className={profile.cardHeader}>
          <div>
            <h2 id="profile-about-title" className={profile.cardTitle}>About you</h2>
            <p className={profile.cardText}>Tell your team what you do.</p>
          </div>
          <ComingSoonBadge />
        </div>
        <div className={profile.cardBody}>
          <div className={profile.form}>
            <div className={profile.field}>
              <label htmlFor="profile-job-title" className={profile.label}>Job title</label>
              <input id="profile-job-title" type="text" className={profile.input} disabled />
            </div>
            <div className={profile.field}>
              <label htmlFor="profile-about" className={profile.label}>About me</label>
              <textarea id="profile-about" className={profile.textarea} disabled />
            </div>
          </div>
        </div>
      </section>

      <div className={profile.comingSoonGrid}>
        <ComingSoonCard
          icon={FiCheckSquare}
          title="My work"
          text="Your open tasks across all your projects."
        />
        <ComingSoonCard
          icon={FiActivity}
          title="Recent activity"
          text="What you've recently changed in your projects."
        />
        <ComingSoonCard
          icon={FiSun}
          title="Out of office"
          text="Let your team know when you're away."
        />
      </div>
    </>
  );
};

export default ProfileTab;
