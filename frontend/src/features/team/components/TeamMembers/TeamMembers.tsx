import React from "react";
import { FiEdit2 } from "react-icons/fi";

import * as team from "features/team/styles/teamClasses";

import { isActive, memberRole } from "features/team/data";
import { formatDate } from "features/tasks/data";
import type { TeamMember } from "features/team/types";

interface TeamMembersProps {
  members: TeamMember[];
  onEdit: (member: TeamMember) => void;
}

// The project's members as a table (a card per member on small screens)
const TeamMembers = ({ members, onEdit }: TeamMembersProps) => {
  return (
    <div className={team.tableCard}>
      <table className={team.table}>
        <thead className={team.thead}>
          <tr>
            <th className={team.th}>Member</th>
            <th className={team.th}>Role</th>
            <th className={team.th}>Status</th>
            <th className={team.th}>Added</th>
            <th className={team.th}><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className={team.tbody}>
          {members.map((member) => {
            const role = memberRole(member);
            const active = isActive(member);
            return (
              <tr key={member.userid} className={team.tr}>
                <td className={team.td}>
                  <div className={team.member}>
                    <span className={active ? team.avatar : team.avatarInactive} aria-hidden="true">
                      {member.name.substring(0, 1)}
                    </span>
                    <div className="min-w-0">
                      <p className={team.memberName}>{member.name}</p>
                      <p className={team.memberEmail}>{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className={team.tdMeta}>
                  <span className={role ? team.role : team.roleEmpty}>{role || "No role"}</span>
                </td>
                <td className={team.tdMeta}>
                  <span className={active ? team.statusActive : team.statusInactive}>
                    <span className={team.statusDot} aria-hidden="true" />
                    {active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className={team.tdMeta}>
                  <span className={team.metaLabel}>Added</span>
                  {formatDate(member.addedDate) || "–"}
                </td>
                <td className={team.tdAction}>
                  <button
                    type="button"
                    className={`${team.btnGhost} ${team.btnSmall}`}
                    onClick={() => onEdit(member)}
                    aria-label={`Edit ${member.name}`}
                  >
                    <FiEdit2 aria-hidden="true" />
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TeamMembers;
