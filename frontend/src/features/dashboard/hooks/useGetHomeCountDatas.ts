import { useState } from "react";
import axios from "shared/services/axios";
import type { HomeTaskCounts } from "features/dashboard/types";
import type { ApiResponse } from "shared/types";

const useGetHomeCountDatas = () => {
  const [homeDatas, setHomeDatas] = useState<Partial<HomeTaskCounts>>({});

  const getHomeCountData = async (projId: string | null) => {
    const resp = await axios.get<ApiResponse<HomeTaskCounts>>(`/task/getHomeTaskCounts/${projId}`);

    setHomeDatas(resp.data.data);
  };
  return [homeDatas, getHomeCountData] as const;
};

export default useGetHomeCountDatas;
