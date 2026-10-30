import axios from "shared/services/axios";

const useResetPassword = () => {
  const resetMyPassword = async (token: string | null, pass: string) => {
    try {
      const resp = await axios.post<string>(
        `/auth/resetMyPassword?token=${token}&pass=${pass}`
      );

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [resetMyPassword] as const;
};

export default useResetPassword;
