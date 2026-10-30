import axios from "Services/axios";

const useAddTeamMember = () => {
  const addTeamMember = async (teamRequest) => {
    try {
      const resp = await axios.post("/team/newTeamMember", teamRequest);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [addTeamMember];
};

export default useAddTeamMember;
