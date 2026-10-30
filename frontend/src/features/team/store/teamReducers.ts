import { SET_ONE_TEAM_MEMBER, SET_TEAM_MEMBER_LIST } from "shared/store/types";
import type { TeamMember, TeamState } from "features/team/types";

export type TeamAction =
  | { type: typeof SET_TEAM_MEMBER_LIST; payload: TeamMember[] }
  | { type: typeof SET_ONE_TEAM_MEMBER; payload: Partial<TeamMember> };

const initialState: TeamState = {
  allTeamMember: [],
  selectedMember: {},
};

const teamMembers = (state = initialState, action: TeamAction): TeamState => {
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
