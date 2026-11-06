import React from "react";
import Helmet from "react-helmet";
import { Link, useSearchParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import * as profile from "features/profile/styles/profileClasses";

import ProfileHeader from "features/profile/components/ProfileHeader/ProfileHeader";
import ProfileTab from "features/profile/components/ProfileTab/ProfileTab";
import SecurityTab from "features/profile/components/SecurityTab/SecurityTab";
import ProjectsTopBar from "features/projects/components/ProjectsTopBar/ProjectsTopBar";
import { useAppSelector } from "app/hooks";

const tabs = [
  { id: "profile", title: "Profile" },
  { id: "security", title: "Security" },
];

// The signed-in user's own account. The open tab is in the URL, so a reload stays on it.
const UserProfile = () => {
  const user = useAppSelector((state) => state.security.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = tabs.find((item) => item.id === searchParams.get("tab"))?.id ?? "profile";

  const openTab = (id: string) => {
    setSearchParams(id === "profile" ? {} : { tab: id }, { replace: true });
  };

  // Arrow keys move between the tabs, as tabs are one stop for the Tab key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
      return;
    }
    const step = e.key === "ArrowRight" ? 1 : -1;
    const index = tabs.findIndex((item) => item.id === activeTab);
    const next = tabs[(index + step + tabs.length) % tabs.length].id;
    openTab(next);
    document.getElementById(`profile-tab-${next}`)?.focus();
  };

  return (
    <div className={profile.page}>
      <Helmet>
        <title>Profile | ProBucket</title>
      </Helmet>
      <ProjectsTopBar />

      <main className={profile.container}>
        <Link to="/projects" className={profile.backLink}>
          <FiArrowLeft aria-hidden="true" />
          All projects
        </Link>

        <ProfileHeader user={user} />

        <div className={profile.tabs} role="tablist" aria-label="Account" onKeyDown={handleKeyDown}>
          {tabs.map((item) => (
            <button
              key={item.id}
              id={`profile-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={item.id === activeTab}
              aria-controls="profile-tab-panel"
              tabIndex={item.id === activeTab ? 0 : -1}
              className={item.id === activeTab ? profile.tabActive : profile.tab}
              onClick={() => openTab(item.id)}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div
          id="profile-tab-panel"
          role="tabpanel"
          aria-labelledby={`profile-tab-${activeTab}`}
          className={profile.panel}
        >
          {activeTab === "profile" ? <ProfileTab user={user} /> : <SecurityTab userId={user.id} />}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
