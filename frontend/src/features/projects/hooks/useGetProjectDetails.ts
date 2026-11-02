import { useState } from "react";
import axios from "shared/services/axios";
import type { Project } from "features/projects/types";
import type { ApiResponse } from "shared/types";

const useGetProjectDetails = () => {
  const [project, setProject] = useState<Partial<Project>>({});

  const getProjectDetails = async (projectId: string | null) => {
    try {
      const resp = await axios.get<ApiResponse<Project>>(`/project/getProjectDetails/${projectId}`);
      setProject(resp.data.data);
      return resp;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return [project, getProjectDetails] as const;
};

export default useGetProjectDetails;
