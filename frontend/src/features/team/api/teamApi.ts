import { api, responseData } from "shared/services/api";
import type { AddTeamMemberRequest, NewTeamMember, TeamMember, UpdateTeamRequest } from "features/team/types";
import type { ApiResponse } from "shared/types";

const teamApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTeamMembers: build.query<TeamMember[], string | null | undefined>({
      query: (projectId) => ({ url: `/team/getTeamMembers/${projectId}` }),
      transformResponse: responseData<TeamMember[]>,
      providesTags: ["TeamMember"],
    }),
    // Recorded in the project's activity
    addTeamMember: build.mutation<ApiResponse<NewTeamMember>, AddTeamMemberRequest>({
      query: (teamRequest) => ({ url: "/team/newTeamMember", method: "POST", data: teamRequest }),
      invalidatesTags: ["TeamMember", "Activity"],
    }),
    updateTeamMember: build.mutation<ApiResponse, UpdateTeamRequest>({
      query: (updateTeam) => ({ url: "/team/updateTeamMember", method: "POST", data: updateTeam }),
      invalidatesTags: ["TeamMember"],
    }),
  }),
});

export const { useGetTeamMembersQuery, useAddTeamMemberMutation, useUpdateTeamMemberMutation } = teamApi;
