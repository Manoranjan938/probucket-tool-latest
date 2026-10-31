import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useLocation } from "react-router-dom";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";

import HomeOverview from "features/dashboard/components/HomeOverview/HomeOverview";
import TeamMemberNotification from "features/dashboard/components/TeamMemberNotification/TeamMemberNotification";
import useGetTeamMembersList from "features/team/hooks/useGetTeamMembersList";
import { dashboardLink } from "features/dashboard/data";
import type { RootState } from "app/store";

const TeamDashboardHome = ({ currentUser }: Props) => {
  const [teamList, getTeamLists] = useGetTeamMembersList();
  const [teamLoaded, setTeamLoaded] = useState(false);

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const param = query.get("project");
  const name = query.get("name");

  // Team members can't add members, so only admins are asked to
  const canAddMembers = currentUser.rolename !== "ROLE_TEAM-USER";

  useEffect(() => {
    if (!canAddMembers) {
      return;
    }
    getTeamLists(param)
      .then(() => setTeamLoaded(true))
      .catch((err) => console.log(err));
  }, [param]);

  return (
    <>
      <Helmet>
        <title>Team Dashboard | Home</title>
      </Helmet>
      <HomeOverview type="team">
        {canAddMembers && teamLoaded && teamList.length === 0 ? (
          <TeamMemberNotification teamMembersLink={dashboardLink("team", "new-user", param, name)} />
        ) : null}
      </HomeOverview>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentUser: state.security.user,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(TeamDashboardHome);
