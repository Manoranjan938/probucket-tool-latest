import axios from "shared/services/axios";
import type { UpdateTeamRequest } from "features/team/types";

const useUpdateTeamMember = () => {
  const updateTeamMember = async (updateTeam: UpdateTeamRequest) => {
    try {
      const resp = await axios.post<string>("/team/updateTeamMember", updateTeam);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [updateTeamMember] as const;
};

export default useUpdateTeamMember;
