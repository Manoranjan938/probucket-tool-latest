import { useSnackbar } from "notistack";

import { useUpdateAssigneeMutation } from "features/tasks/api/tasksApi";
import { toastOptions } from "features/tasks/data";
import type { AssigneeOption } from "features/tasks/hooks/useAssigneeOptions";
import { getApiErrorMessage } from "shared/services/apiError";

// Assigns a saved task to someone, or nobody, straight away, and says how it went
const useChangeAssignee = () => {
  const [updateAssignee] = useUpdateAssigneeMutation();
  const { enqueueSnackbar } = useSnackbar();

  return async (taskId: string, option: AssigneeOption | null) => {
    try {
      await updateAssignee({ taskId, assignee: option?.email ?? "" }).unwrap();
      enqueueSnackbar(option ? `Assigned to ${option.name}` : "Task unassigned", { ...toastOptions, variant: "success" });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, "Couldn't change the assignee. Please try again."), {
        ...toastOptions,
        variant: "error",
      });
    }
  };
};

export default useChangeAssignee;
