import { useState } from "react";
import axios from "Services/axios";

const useGetProjectDetails = () => {
  const [project, setProject] = useState({});

  const getProjectDetails = async (projectId) => {
    const token = localStorage.getItem("jwtToken");
    try {
      const resp = await axios.get(`/project/getProjectDetails/${projectId}`, {
        headers: { Authorization: token },
      });
      setProject(resp.data);
      return resp;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return [project, getProjectDetails];
};

export default useGetProjectDetails;
