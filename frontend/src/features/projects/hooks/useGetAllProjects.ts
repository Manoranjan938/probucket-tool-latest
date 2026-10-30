import axios from "shared/services/axios";
import { useState } from "react";
import type { Project } from "features/projects/types";

const useGetAllProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const getAllProjectDetails = async (userId: string | undefined) => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await axios.get<Project[]>(`/project/getProjects/${userId}`, {
        // TODO(ts-migration): token is null when logged out – the header is then sent as the string "null"
        headers: { Authorization: token as string },
      });

      setProjects(res.data);
      return res;
    } catch (err) {
      throw err;
    }
  };

  return [projects, getAllProjectDetails] as const;
};

export default useGetAllProjects;
