import { useState } from "react";
import axios from "shared/services/axios";
import type { TeamMember } from "features/team/types";

const useGetTeamMembersList = () => {
  const [teamList, setTeamList] = useState<TeamMember[]>([]);

  const getTeamLists = async (projectId: string | null | undefined) => {
    try {
      const resp = await axios.get<TeamMember[]>(`/team/getTeamMembers/${projectId}`);

      setTeamList(resp.data);
      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [teamList, getTeamLists] as const;
};

export default useGetTeamMembersList;
