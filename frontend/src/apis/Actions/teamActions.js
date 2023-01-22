import { SET_ONE_TEAM_MEMBER, SET_TEAM_MEMBER_LIST } from "./types";

export const getAllTeamMembers = (teamList) => (dispatch) => {
  dispatch({
    type: SET_TEAM_MEMBER_LIST,
    payload: teamList,
  });
};

export const getSelectedTeamMember = (teamMember) => (dispatch) => {
  dispatch({
    type: SET_ONE_TEAM_MEMBER,
    payload: teamMember,
  });
};
