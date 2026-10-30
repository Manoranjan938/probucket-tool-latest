import { useState } from "react";
import axios from "Services/axios";

const useGetHomeCountDatas = () => {
  const [homeDatas, setHomeDatas] = useState({});

  const getHomeCountData = async (projId) => {
    const resp = await axios.get(`/task/getHomeTaskCounts/${projId}`);

    setHomeDatas(resp.data);
  };
  return [homeDatas, getHomeCountData];
};

export default useGetHomeCountDatas;
