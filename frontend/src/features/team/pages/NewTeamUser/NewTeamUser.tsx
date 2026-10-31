import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useLocation } from "react-router-dom";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import { FiUserPlus, FiUsers } from "react-icons/fi";

import * as team from "features/team/styles/teamClasses";

import TeamMembers from "features/team/components/TeamMembers/TeamMembers";
import AddMember from "features/team/components/AddMember/AddMember";
import EditMember from "features/team/components/EditMember/EditMember";
import { MembersTableSkeleton } from "features/team/pages/NewTeamUser/NewTeamUserSkeleton";
import useGetTeamMembersList from "features/team/hooks/useGetTeamMembersList";
import { getAllTeamMembers } from "features/team/store/teamActions";
import type { AppDispatch } from "app/store";
import type { TeamMember } from "features/team/types";

// Team members page of the team dashboard (admins only – the sidebar hides it from team members)
const NewTeamUser = ({ getTeamList }: Props) => {
  const [teamList, getTeamLists] = useGetTeamMembersList();
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);

  const { search } = useLocation();
  const projectId = new URLSearchParams(search).get("project");

  const loadMembers = async () => {
    try {
      await getTeamLists(projectId);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // The task details read the members from the store for the assignee picker
  useEffect(() => {
    getTeamList(teamList);
  }, [teamList]);

  return (
    <div className={team.page}>
      <Helmet>
        <title>Team Dashboard | Team members</title>
      </Helmet>

      <div className={team.header}>
        <p className={team.count}>
          {teamList.length > 0 ? `${teamList.length} ${teamList.length === 1 ? "member" : "members"}` : ""}
        </p>
        <button type="button" className={team.btnPrimary} onClick={() => setShowAdd(true)}>
          <FiUserPlus aria-hidden="true" />
          Add member
        </button>
      </div>

      {loading ? (
        <MembersTableSkeleton />
      ) : teamList.length > 0 ? (
        <TeamMembers members={teamList} onEdit={setEditing} />
      ) : (
        <div className={team.empty}>
          <span className={team.emptyIcon} aria-hidden="true">
            <FiUsers />
          </span>
          <h2 className={team.emptyTitle}>No team members yet</h2>
          <p className={team.emptyText}>
            Add the people you work with so you can assign them tasks on this project.
          </p>
          <button type="button" className={team.btnPrimary} onClick={() => setShowAdd(true)}>
            <FiUserPlus aria-hidden="true" />
            Add member
          </button>
        </div>
      )}

      <AddMember open={showAdd} onClose={() => setShowAdd(false)} onAdded={loadMembers} projectId={projectId} />
      <EditMember member={editing} onClose={() => setEditing(null)} onSaved={loadMembers} />
    </div>
  );
};

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getTeamList: (data: TeamMember[]) => dispatch(getAllTeamMembers(data)),
  };
}

const withConnect = connect(null, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(NewTeamUser);
