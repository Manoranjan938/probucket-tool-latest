import axios from "Services/axios";

const useCreateNewProject = () => {
  const createNewProject = async (projectRequest) => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await axios.post("/project/createProject", projectRequest, {
        headers: { Authorization: token },
      });

      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return [createNewProject];
};

export default useCreateNewProject;
