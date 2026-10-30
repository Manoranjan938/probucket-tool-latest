import { SET_ONE_TEAM_MEMBER, SET_TEAM_MEMBER_LIST } from "apis/Actions/types";

const initialState = {
  allTeamMember: [],
  selectedMember: {},
};

const teamMembers = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEAM_MEMBER_LIST:
      return {
        ...state,
        allTeamMember: action.payload,
      };

    case SET_ONE_TEAM_MEMBER:
      return {
        ...state,
        selectedMember: action.payload,
      };

    default:
      return state;
  }
};

export default teamMembers;
