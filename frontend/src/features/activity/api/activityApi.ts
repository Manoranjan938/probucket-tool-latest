import { api, responseData } from "shared/services/api";
import type { Activity, ActivityLogFilters, ActivityPage, ActivityPerson } from "features/activity/types";

export interface ActivityLogArgs extends ActivityLogFilters {
  /** projectIdentifier – the "name" query parameter */
  projectIdentifier: string;
}

const activityApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProjectActivity: build.query<Activity[], string | null>({
      query: (projectIdentifier) => ({ url: `/activity/getProjectActivity/${projectIdentifier}` }),
      transformResponse: responseData<Activity[]>,
      providesTags: ["Activity"],
    }),
    // The Activity page. Each page continues after the last entry of the one before, so entries added
    // in the meantime don't shift the pages; a change elsewhere reloads every page shown.
    getProjectActivityLog: build.infiniteQuery<ActivityPage, ActivityLogArgs, number | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.items[lastPage.items.length - 1]?.id : undefined),
      },
      query: ({ queryArg: { projectIdentifier, types, ...filters }, pageParam }) => ({
        url: `/activity/getProjectActivityLog/${projectIdentifier}`,
        // Comma separated, as axios would otherwise send types[]=…
        params: { ...filters, types: types?.length ? types.join(",") : undefined, before: pageParam ?? undefined },
      }),
      transformResponse: responseData<ActivityPage>,
      providesTags: ["Activity"],
    }),
    getProjectActivityPeople: build.query<ActivityPerson[], string>({
      query: (projectIdentifier) => ({ url: `/activity/getProjectActivityPeople/${projectIdentifier}` }),
      transformResponse: responseData<ActivityPerson[]>,
      providesTags: ["Activity"],
    }),
    getTaskActivity: build.query<Activity[], string>({
      query: (taskSequence) => ({ url: `/activity/getTaskActivity/${taskSequence}` }),
      transformResponse: responseData<Activity[]>,
      providesTags: ["Activity"],
    }),
  }),
});

export const {
  useGetProjectActivityQuery,
  useGetProjectActivityLogInfiniteQuery,
  useGetProjectActivityPeopleQuery,
  useGetTaskActivityQuery,
} = activityApi;
