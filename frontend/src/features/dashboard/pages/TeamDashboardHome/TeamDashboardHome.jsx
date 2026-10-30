//import TeamHomeHeader from "features/dashboard/components/TeamHomeHeader/TeamHomeHeader";
import TeamTaskAndBugList from "features/dashboard/components/TeamTaskAndBugList/TeamTaskAndBugList";
import TeamTaskCards from "features/dashboard/components/TeamTaskCards/TeamTaskCards";
import TeamMemberNotification from "features/dashboard/components/TeamMemberNotification/TeamMemberNotification";
import React, { useEffect } from "react";
import Helmet from "react-helmet";
import useGetTeamMembersList from "features/team/hooks/useGetTeamMembersList";
import { useLocation } from "react-router-dom";

const TeamDashboardHome = () => {
  const [teamList, getTeamLists] = useGetTeamMembersList();

  let { search } = useLocation();

  const query = new URLSearchParams(search);
  const param = query.get("project");

  useEffect(() => {
    getTeamLists(param);
  }, []);

  useEffect(() => {
    getTeamLists(param);
  }, [param]);

  return (
    <>
      <Helmet>
        <title>Team Dashboars | Home</title>
      </Helmet>
      {/* <TeamHomeHeader /> */}
      <TeamTaskCards />
      {teamList.length === 0 && <TeamMemberNotification />}
      {/* <TeamTaskAndBugList /> */}
    </>
  );
};

export default TeamDashboardHome;
