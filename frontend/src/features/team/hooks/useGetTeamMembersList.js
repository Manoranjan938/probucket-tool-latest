import { useState } from "react";
import axios from "Services/axios";

const useGetTeamMembersList = () => {
  const [teamList, setTeamList] = useState([]);

  const getTeamLists = async (projectId) => {
    try {
      const resp = await axios.get(`/team/getTeamMembers/${projectId}`);

      setTeamList(resp.data);
      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [teamList, getTeamLists];
};

export default useGetTeamMembersList;
