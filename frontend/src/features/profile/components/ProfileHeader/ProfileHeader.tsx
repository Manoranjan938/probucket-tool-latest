import React from "react";

import * as profile from "features/profile/styles/profileClasses";

import { roleLabels } from "features/profile/data";
import type { AuthUser } from "features/auth/types";

// The signed-in user at the top of the Profile page
// TODO(profile-backend): add the verified badge and member since – see features/profile/BACKEND_TODO.md
const ProfileHeader = ({ user }: { user: Partial<AuthUser> }) => {
  const role = roleLabels[user.rolename ?? ""];

  return (
    <div className={profile.header}>
      <span className={profile.headerAvatar} aria-hidden="true">
        {user.fullName?.substring(0, 1)}
      </span>
      <div className={profile.headerText}>
        <h1 className={profile.headerName}>{user.fullName}</h1>
        <p className={profile.headerEmail} title={user.username}>{user.username}</p>
      </div>
      {role ? <span className={profile.roleBadge}>{role}</span> : null}
    </div>
  );
};

export default ProfileHeader;
