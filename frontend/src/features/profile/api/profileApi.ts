import { api } from "shared/services/api";
import type { UpdatePasswordRequest } from "features/profile/types";
import type { ApiResponse } from "shared/types";

const profileApi = api.injectEndpoints({
  endpoints: (build) => ({
    updatePassword: build.mutation<ApiResponse, UpdatePasswordRequest>({
      query: (update) => ({ url: "/user/updatePassword", method: "POST", data: update }),
    }),
  }),
});

export const { useUpdatePasswordMutation } = profileApi;
