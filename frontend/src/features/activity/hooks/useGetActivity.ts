import axios from "shared/services/axios";
import type { Activity } from "features/activity/types";
import type { ApiResponse } from "shared/types";

const useGetActivity = () => {
  const getProjectActivity = async (projectIdentifier: string | null) => {
    const resp = await axios.get<ApiResponse<Activity[]>>(`/activity/getProjectActivity/${projectIdentifier}`);

    return resp;
  };

  const getTaskActivity = async (taskSequence: string | undefined) => {
    const resp = await axios.get<ApiResponse<Activity[]>>(`/activity/getTaskActivity/${taskSequence}`);

    return resp;
  };

  return { getProjectActivity, getTaskActivity };
};

export default useGetActivity;
