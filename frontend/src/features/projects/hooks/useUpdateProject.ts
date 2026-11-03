import axios from "shared/services/axios";
import type { UpdateProjectRequest } from "features/projects/types";
import type { ApiResponse } from "shared/types";

const useUpdateProject = () => {
  const updateProject = (update: UpdateProjectRequest) => axios.put<ApiResponse>("/project/updateProject", update);

  return [updateProject] as const;
};

export default useUpdateProject;
