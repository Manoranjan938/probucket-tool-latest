import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useLocation } from "react-router-dom";

import HomeOverview from "features/dashboard/components/HomeOverview/HomeOverview";
import TeamMemberNotification from "features/dashboard/components/TeamMemberNotification/TeamMemberNotification";
import useGetTeamMembersList from "features/team/hooks/useGetTeamMembersList";
import { dashboardLink } from "features/dashboard/data";
import type { TeamMember } from "features/team/types";
import { useAppSelector } from "app/hooks";

const TeamDashboardHome = () => {
  const currentUser = useAppSelector((state) => state.security.user);
  const [, getTeamLists] = useGetTeamMembersList();
  // undefined while loading, null if it couldn't be loaded
  const [team, setTeam] = useState<TeamMember[] | null>();

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const param = query.get("project");
  const name = query.get("name");

  // Team members can't add members, so only admins are asked to
  const canAddMembers = currentUser.rolename !== "ROLE_TEAM-USER";

  useEffect(() => {
    let current = true;
    setTeam(undefined);
    getTeamLists(param)
      .then((resp) => {
        if (current) {
          setTeam(resp.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
        if (current) {
          setTeam(null);
        }
      });
    return () => {
      current = false;
    };
  }, [param]);

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
