import { api, responseData } from "shared/services/api";
import type { Activity } from "features/activity/types";

const activityApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProjectActivity: build.query<Activity[], string | null>({
      query: (projectIdentifier) => ({ url: `/activity/getProjectActivity/${projectIdentifier}` }),
      transformResponse: responseData<Activity[]>,
      providesTags: ["Activity"],
    }),
    getTaskActivity: build.query<Activity[], string>({
      query: (taskSequence) => ({ url: `/activity/getTaskActivity/${taskSequence}` }),
      transformResponse: responseData<Activity[]>,
      providesTags: ["Activity"],
    }),
  }),
});

export const { useGetProjectActivityQuery, useGetTaskActivityQuery } = activityApi;
