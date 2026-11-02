import { useState } from "react";
import axios from "shared/services/axios";
import type { TeamMember } from "features/team/types";
import type { ApiResponse } from "shared/types";

const useGetTeamMembersList = () => {
  const [teamList, setTeamList] = useState<TeamMember[]>([]);

  const getTeamLists = async (projectId: string | null | undefined) => {
    try {
      const resp = await axios.get<ApiResponse<TeamMember[]>>(`/team/getTeamMembers/${projectId}`);

      setTeamList(resp.data.data);
      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [teamList, getTeamLists] as const;
};

export default useGetTeamMembersList;
