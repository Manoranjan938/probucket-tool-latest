import axios from "shared/services/axios";
import type { ProjectRequest } from "features/projects/types";
import type { ApiResponse } from "shared/types";

const useCreateNewProject = () => {
  const createNewProject = async (projectRequest: ProjectRequest) => {
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await axios.post<ApiResponse>("/project/createProject", projectRequest, {
        // TODO(ts-migration): token is null when logged out – the header is then sent as the string "null"
        headers: { Authorization: token as string },
      });

      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return [createNewProject] as const;
};

export default useCreateNewProject;
