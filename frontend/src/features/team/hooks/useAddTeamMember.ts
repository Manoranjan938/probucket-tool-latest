import axios from "shared/services/axios";
import type { AddTeamMemberRequest, NewTeamMember } from "features/team/types";
import type { ApiResponse } from "shared/types";

const useAddTeamMember = () => {
  const addTeamMember = async (teamRequest: AddTeamMemberRequest) => {
    const resp = await axios.post<ApiResponse<NewTeamMember>>("/team/newTeamMember", teamRequest);

    return resp;
  };

  return [addTeamMember] as const;
};

export default useAddTeamMember;
