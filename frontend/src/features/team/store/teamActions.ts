import type { Dispatch } from "redux";
import { SET_ONE_TEAM_MEMBER, SET_TEAM_MEMBER_LIST } from "shared/store/types";
import type { TeamMember } from "features/team/types";
import type { TeamAction } from "./teamReducers";

export const getAllTeamMembers = (teamList: TeamMember[]) => (dispatch: Dispatch<TeamAction>) => {
  dispatch({
    type: SET_TEAM_MEMBER_LIST,
    payload: teamList,
  });
};

export const getSelectedTeamMember = (teamMember: Partial<TeamMember>) => (dispatch: Dispatch<TeamAction>) => {
  dispatch({
    type: SET_ONE_TEAM_MEMBER,
    payload: teamMember,
  });
};
