import React, { useEffect } from "react";
import { Tooltip } from "@mui/material";
import { FiSearch } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import useGetTeamMembersList from "features/team/hooks/useGetTeamMembersList";
import { useAppDispatch } from "app/hooks";
import { setAllTeamMembers } from "features/team/store/teamsSlice";

const MAX_AVATARS = 5;

type Props = { projectId: string | null };

// Team board toolbar: search and the team members. Also loads the members into the store,
// where the task details read them for the assignee picker.
const TeamWorkHeader = ({ projectId }: Props) => {
  const dispatch = useAppDispatch();
  const [teamList, getTeamLists] = useGetTeamMembersList();

  useEffect(() => {
    getTeamLists(projectId).catch((err) => console.log(err));
  }, [projectId]);

  useEffect(() => {
    dispatch(setAllTeamMembers(teamList));
  }, [teamList]);

  return (
    <>
      {/* Not wired up yet – kept so the toolbar looks complete */}
      <label className={task.search}>
        <FiSearch aria-hidden="true" />
        <input type="search" placeholder="Search tasks" aria-label="Search tasks" className={task.searchInput} />
      </label>

      {teamList.length > 0 ? (
        <ul className={`${task.avatarStack} m-0 p-0 list-none`} aria-label="Team members">
          {teamList.slice(0, MAX_AVATARS).map((item) => (
            <Tooltip title={item.name} key={item.userid}>
              <li className={task.avatarStacked} aria-label={item.name}>
                {item.name.substring(0, 1)}
              </li>
            </Tooltip>
          ))}
          {teamList.length > MAX_AVATARS ? (
            <li className={task.avatarMore} aria-label={`${teamList.length - MAX_AVATARS} more`}>
              +{teamList.length - MAX_AVATARS}
            </li>
          ) : null}
        </ul>
      ) : null}
    </>
  );
};

export default TeamWorkHeader;
