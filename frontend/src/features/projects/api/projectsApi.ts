import { api, responseData } from "shared/services/api";
import type { AuthUser } from "features/auth/types";
import type { Project, ProjectRequest, UpdateProjectRequest } from "features/projects/types";
import type { ApiResponse } from "shared/types";

const LIST = { type: "Project", id: "LIST" } as const;

const projectsApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Team members are added to projects, everyone else sees the projects they created
    getMyProjects: build.query<Project[], Pick<Partial<AuthUser>, "id" | "rolename">>({
      query: ({ id, rolename }) => ({
        url: rolename === "ROLE_TEAM-USER" ? `/team/getProjectsByTeam/${id}` : `/project/getProjects/${id}`,
      }),
      transformResponse: responseData<Project[]>,
      providesTags: [LIST],
    }),
    getProjectDetails: build.query<Project, string | null>({
      query: (projectId) => ({ url: `/project/getProjectDetails/${projectId}` }),
      transformResponse: responseData<Project>,
      providesTags: (_result, _error, projectId) => [{ type: "Project", id: projectId ?? undefined }],
    }),
    createProject: build.mutation<ApiResponse, ProjectRequest>({
      query: (projectRequest) => ({ url: "/project/createProject", method: "POST", data: projectRequest }),
      invalidatesTags: [LIST],
    }),
    updateProject: build.mutation<ApiResponse, UpdateProjectRequest>({
      query: (update) => ({ url: "/project/updateProject", method: "PUT", data: update }),
      // The new name shows at once, without loading the details again
      async onQueryStarted({ projectId, projectName }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            projectsApi.util.updateQueryData("getProjectDetails", projectId, (project) => {
              project.projectName = projectName;
            })
          );
        } catch {
          // The caller shows the error
        }
      },
      invalidatesTags: [LIST],
    }),
  }),
});

export const {
  useGetMyProjectsQuery,
  useLazyGetMyProjectsQuery,
  useGetProjectDetailsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} = projectsApi;
