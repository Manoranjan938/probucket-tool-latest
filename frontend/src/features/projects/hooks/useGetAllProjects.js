import axios from "Services/axios";
import { useState } from "react";

const useGetAllProjects = () => {
  const [projects, setProjects] = useState([]);

  const getAllProjectDetails = async (userId) => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await axios.get(`/project/getProjects/${userId}`, {
        headers: { Authorization: token },
      });

      setProjects(res.data);
      return res;
    } catch (err) {
      throw err;
    }
  };

  return [projects, getAllProjectDetails];
};

export default useGetAllProjects;
