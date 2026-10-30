import axios from "Services/axios";

const useUpdateTeamMember = () => {
  const updateTeamMember = async (updateTeam) => {
    try {
      const resp = await axios.post("/team/updateTeamMember", updateTeam);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [updateTeamMember];
};

export default useUpdateTeamMember;
