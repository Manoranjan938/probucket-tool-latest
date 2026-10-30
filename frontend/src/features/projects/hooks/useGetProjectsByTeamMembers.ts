import axios from "shared/services/axios";
import { useState } from "react";
import type { Project } from "features/projects/types";

const useGetProjectsByTeamMembers = () => {
  const [teamProjects, setTeamProjects] = useState<Project[]>([]);

  const getProjectsByTeam = async (userId: string | undefined) => {
    try {
      const resp = await axios.get<Project[]>(`/team/getProjectsByTeam/${userId}`);

      setTeamProjects(resp.data);
    } catch (err) {
      throw err;
    }
  };

  return [teamProjects, getProjectsByTeam] as const;
};

export default useGetProjectsByTeamMembers;
