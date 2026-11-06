import { skipToken } from "@reduxjs/toolkit/query/react";
import { useAppSelector } from "app/hooks";
import { useGetTaskDetailsQuery } from "features/tasks/api/tasksApi";

// The task open in the details panel. Every caller shares one cached request.
// currentData is undefined while nothing is open, or while another task is still loading.
const useSelectedTask = () => {
  const sequence = useAppSelector((state) => state.tasks.selectedTaskSequence);

  return useGetTaskDetailsQuery(sequence ?? skipToken);
};

export default useSelectedTask;
