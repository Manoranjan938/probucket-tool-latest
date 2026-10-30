import axios from "shared/services/axios";
import type { UpdatePasswordRequest } from "features/profile/types";

const useUpdatePassword = () => {
  const updatePassword = async (update: UpdatePasswordRequest) => {
    try {
      const resp = axios.post<string>("/user/updatePassword", update);
      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [updatePassword] as const;
};

export default useUpdatePassword;
