import axios from "shared/services/axios";
import { useState } from "react";
import type { Project } from "features/projects/types";
import type { ApiResponse } from "shared/types";

const useGetAllProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const getAllProjectDetails = async (userId: string | undefined) => {
    try {
      const res = await axios.get<ApiResponse<Project[]>>(`/project/getProjects/${userId}`);

      setProjects(res.data.data);
      return res;
    } catch (err) {
      throw err;
    }
  };

  return [projects, getAllProjectDetails] as const;
};

export default useGetAllProjects;
