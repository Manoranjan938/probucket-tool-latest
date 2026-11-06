import { api, responseData } from "shared/services/api";
import type { HomeTaskCounts } from "features/dashboard/types";

const dashboardApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Changes with the tasks, so it reloads with them
    getHomeTaskCounts: build.query<HomeTaskCounts, string | null>({
      query: (projectId) => ({ url: `/task/getHomeTaskCounts/${projectId}` }),
      transformResponse: responseData<HomeTaskCounts>,
      providesTags: ["Task"],
    }),
  }),
});

export const { useGetHomeTaskCountsQuery } = dashboardApi;
