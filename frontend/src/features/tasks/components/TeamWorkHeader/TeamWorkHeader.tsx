import { Avatar, AvatarGroup, Tooltip } from "@mui/material";
import React, { useEffect } from "react";

import { FaSearch } from "react-icons/fa";

import "./TeamWorkHeader.css";
import useGetTeamMembersList from "features/team/hooks/useGetTeamMembersList";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import { getAllTeamMembers } from "features/team/store/teamActions";
import type { AppDispatch, RootState } from "app/store";
import type { TeamMember } from "features/team/types";

const TeamWorkHeader = ({ currentProject, getTeamList }: Props) => {
  const [teamList, getTeamLists] = useGetTeamMembersList();

  useEffect(() => {
    callGetTeamMembersList();
  }, []);

  const callGetTeamMembersList = async () => {
    await getTeamLists(currentProject.projectId);
  };

  useEffect(() => {
    getTeamList(teamList);
  }, [teamList]);

  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}`,
    };
  }

  const handleClick = (name: string) => {
    console.log(name);
  }

  return (
    <>
      <div className="team_work_header_container">
        <div className="search_task">
          <div className="search__field">
            <FaSearch className="search" />
            <input type="text" placeholder="Search" />
          </div>
        </div>
        <div className="filter_task">
          <div className="filter_by_asignee">
            <AvatarGroup max={6}>
              {teamList != null &&
                teamList.map((item) => (
                  <Tooltip title={item.name} key={item.userid} onClick={() => handleClick(item.name)}>
                    <Avatar {...stringAvatar(item.name)} />
                  </Tooltip>
                ))}
            </AvatarGroup>
          </div>
        </div>
      </div>
    </>
  );
};

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getTeamList: (data: TeamMember[]) => dispatch(getAllTeamMembers(data)),
  };
}

const mapStateToProps = (state: RootState) => ({
  currentProject: state.project.project,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(TeamWorkHeader);
