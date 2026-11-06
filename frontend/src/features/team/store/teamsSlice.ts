import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TeamMember, TeamState } from "features/team/types";

const initialState: TeamState = {
  allTeamMember: [],
};

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setAllTeamMembers: (state, action: PayloadAction<TeamMember[]>) => {
      state.allTeamMember = action.payload;
    },
  },
});

export const { setAllTeamMembers } = teamsSlice.actions;

export default teamsSlice.reducer;
