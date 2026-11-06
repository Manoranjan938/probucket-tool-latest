import axios from "shared/services/axios";
import { useState } from "react";
import type { Project } from "features/projects/types";
import type { ApiResponse } from "shared/types";

const useGetProjectsByTeamMembers = () => {
  const [teamProjects, setTeamProjects] = useState<Project[]>([]);

  const getProjectsByTeam = async (userId: string | undefined) => {
    const resp = await axios.get<ApiResponse<Project[]>>(`/team/getProjectsByTeam/${userId}`);

    setTeamProjects(resp.data.data);
    return resp;
  };

  return [teamProjects, getProjectsByTeam] as const;
};

export default useGetProjectsByTeamMembers;
