import axios from "shared/services/axios";
import type { ProjectRequest } from "features/projects/types";
import type { ApiResponse } from "shared/types";

const useCreateNewProject = () => {
  const createNewProject = async (projectRequest: ProjectRequest) => {
    try {
      const res = await axios.post<ApiResponse>("/project/createProject", projectRequest);

      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return [createNewProject] as const;
};

export default useCreateNewProject;
