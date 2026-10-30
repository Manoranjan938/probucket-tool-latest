import axios from "shared/services/axios";
import type { AddTeamMemberRequest } from "features/team/types";

const useAddTeamMember = () => {
  const addTeamMember = async (teamRequest: AddTeamMemberRequest) => {
    try {
      const resp = await axios.post<string>("/team/newTeamMember", teamRequest);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [addTeamMember] as const;
};

export default useAddTeamMember;
