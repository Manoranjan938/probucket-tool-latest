import React from "react";
import Helmet from "react-helmet";
import { useLocation } from "react-router-dom";

import HomeOverview from "features/dashboard/components/HomeOverview/HomeOverview";
import TeamMemberNotification from "features/dashboard/components/TeamMemberNotification/TeamMemberNotification";
import { useGetTeamMembersQuery } from "features/team/api/teamApi";
import { dashboardLink } from "features/dashboard/data";
import { useAppSelector } from "app/hooks";

const TeamDashboardHome = () => {
  const currentUser = useAppSelector((state) => state.security.user);
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const param = query.get("project");
  const name = query.get("name");
  const { currentData, isError } = useGetTeamMembersQuery(param);
  // undefined while loading, null if it couldn't be loaded
  const team = isError ? null : currentData;

  // Team members can't add members, so only admins are asked to
  const canAddMembers = currentUser.rolename !== "ROLE_TEAM-USER";

  return (
    <>
      <Helmet>
        <title>Team Dashboard | Home</title>
      </Helmet>
      <HomeOverview type="team" team={team}>
        {canAddMembers && team?.length === 0 ? (
          <TeamMemberNotification teamMembersLink={dashboardLink("team", "new-user", param, name)} />
        ) : null}
      </HomeOverview>
    </>
  );
};

export default TeamDashboardHome;
