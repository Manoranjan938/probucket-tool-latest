import React from "react";

import * as profile from "features/profile/styles/profileClasses";

import ChangePasswordCard from "features/profile/components/ChangePasswordCard/ChangePasswordCard";
import ComingSoonBadge from "features/profile/components/ComingSoonBadge/ComingSoonBadge";
import LogoutEverywhereCard from "features/profile/components/LogoutEverywhereCard/LogoutEverywhereCard";

// The Security tab
// TODO(profile-backend): the devices list – see features/profile/BACKEND_TODO.md
const SecurityTab = ({ userId }: { userId: string | undefined }) => {
  return (
    <>
      <ChangePasswordCard userId={userId} />
      <LogoutEverywhereCard />
      <section className={`${profile.card} pb-5`} aria-labelledby="devices-title">
        <div className={profile.cardHeader}>
          <div>
            <h2 id="devices-title" className={profile.cardTitle}>Devices</h2>
            <p className={profile.cardText}>See where you're logged in and log out of a single device.</p>
          </div>
          <ComingSoonBadge />
        </div>
      </section>
    </>
  );
};

export default SecurityTab;
