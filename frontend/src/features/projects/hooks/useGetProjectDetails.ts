import { useState } from "react";
import axios from "shared/services/axios";
import type { Project } from "features/projects/types";

const useGetProjectDetails = () => {
  const [project, setProject] = useState<Partial<Project>>({});

  const getProjectDetails = async (projectId: string | null) => {
    const token = localStorage.getItem("jwtToken");
    try {
      const resp = await axios.get<Project>(`/project/getProjectDetails/${projectId}`, {
        // TODO(ts-migration): token is null when logged out – the header is then sent as the string "null"
        headers: { Authorization: token as string },
      });
      setProject(resp.data);
      return resp;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return [project, getProjectDetails] as const;
};

export default useGetProjectDetails;
