import axios from "shared/services/axios";
import type { UpdateTeamRequest } from "features/team/types";
import type { ApiResponse } from "shared/types";

const useUpdateTeamMember = () => {
  const updateTeamMember = async (updateTeam: UpdateTeamRequest) => {
    try {
      const resp = await axios.post<ApiResponse>("/team/updateTeamMember", updateTeam);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [updateTeamMember] as const;
};

export default useUpdateTeamMember;
