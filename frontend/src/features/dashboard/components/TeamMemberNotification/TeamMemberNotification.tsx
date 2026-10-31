import React from "react";
import { Link } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";

import * as dashboard from "features/dashboard/styles/dashboardClasses";

// Team dashboard home: shown to admins while the project has no team members
const TeamMemberNotification = ({ teamMembersLink }: { teamMembersLink: string }) => {
  return (
    <div className={dashboard.banner}>
      <span className={dashboard.bannerIcon} aria-hidden="true">
        <FiUserPlus />
      </span>
      <p className={dashboard.bannerText}>
        <span className={dashboard.bannerTitle}>Your team is empty.</span> Add team members to assign them
        tasks and work on this project together.
      </p>
      <Link to={teamMembersLink} className={dashboard.btnPrimary}>Add team members</Link>
    </div>
  );
};

export default TeamMemberNotification;
