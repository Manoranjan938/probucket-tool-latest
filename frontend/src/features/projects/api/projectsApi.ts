import { api, responseData } from "shared/services/api";
import type { AuthUser } from "features/auth/types";
import type {
  DeletedProject,
  Project,
  ProjectRequest,
  UpdateProjectRequest,
  UpdateProjectTemplateRequest,
} from "features/projects/types";
import type { ApiResponse } from "shared/types";

const LIST = { type: "Project", id: "LIST" } as const;
// The lead's Recently deleted list
const DELETED = { type: "Project", id: "DELETED" } as const;

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
    // Lead only. The New task dialog follows the new template at once, without loading the details again.
    updateProjectTemplate: build.mutation<ApiResponse, UpdateProjectTemplateRequest>({
      query: (update) => ({ url: "/project/updateProjectTemplate", method: "PUT", data: update }),
      async onQueryStarted({ projectId, projectTemplate }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            projectsApi.util.updateQueryData("getProjectDetails", projectId, (project) => {
              project.projectTemplate = projectTemplate;
            })
          );
        } catch {
          // The caller shows the error
        }
      },
    }),
    getDeletedProjects: build.query<DeletedProject[], string>({
      query: (userId) => ({ url: `/project/getDeletedProjects/${userId}` }),
      transformResponse: responseData<DeletedProject[]>,
      providesTags: [DELETED],
    }),
    // Lead only. The project's details are loaded again, so a page still showing it finds it gone.
    deleteProject: build.mutation<ApiResponse, { projectId: string; userId: string }>({
      query: ({ projectId, userId }) => ({ url: `/project/deleteProject/${projectId}/${userId}`, method: "PUT" }),
      invalidatesTags: (_result, error, { projectId }) => (error ? [] : [LIST, DELETED, { type: "Project", id: projectId }]),
    }),
    restoreProject: build.mutation<ApiResponse, string>({
      query: (projectId) => ({ url: `/project/restoreProject/${projectId}`, method: "PUT" }),
      invalidatesTags: (_result, error, projectId) => (error ? [] : [LIST, DELETED, { type: "Project", id: projectId }]),
    }),
    // Lead only, from Recently deleted. Can't be undone.
    deleteProjectForever: build.mutation<ApiResponse, string>({
      query: (projectId) => ({ url: `/project/deleteProjectForever/${projectId}`, method: "DELETE" }),
      invalidatesTags: (_result, error) => (error ? [] : [DELETED]),
    }),
  }),
});

export const {
  useGetMyProjectsQuery,
  useLazyGetMyProjectsQuery,
  useGetProjectDetailsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useUpdateProjectTemplateMutation,
  useGetDeletedProjectsQuery,
  useDeleteProjectMutation,
  useRestoreProjectMutation,
  useDeleteProjectForeverMutation,
} = projectsApi;
