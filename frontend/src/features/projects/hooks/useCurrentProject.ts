import { useLocation } from "react-router-dom";
import { useGetProjectDetailsQuery } from "features/projects/api/projectsApi";

// The project of the dashboard, from the "project" query parameter. Every caller shares one cached request.
// currentData is undefined while another project's details are still loading.
const useCurrentProject = () => {
  const { search } = useLocation();
  const projectId = new URLSearchParams(search).get("project");

  return useGetProjectDetailsQuery(projectId);
};

export default useCurrentProject;
