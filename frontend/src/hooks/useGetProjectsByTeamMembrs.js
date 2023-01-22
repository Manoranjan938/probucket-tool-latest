import axios from "Services/axios";
import { useState } from "react";

const useGetProjectsByTeamMembrs = () => {
  const [teamProjects, setTeamProjects] = useState([]);

  const getProjectsByTeam = async (userId) => {
    try {
      const resp = await axios.get(`/team/getProjectsByTeam/${userId}`);

      setTeamProjects(resp.data);
    } catch (err) {
      throw err;
    }
  };

  return [teamProjects, getProjectsByTeam];
};

export default useGetProjectsByTeamMembrs;
