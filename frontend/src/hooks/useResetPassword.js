import axios from "Services/axios";

const useResetPassword = () => {
  const resetMyPassword = async (token, pass) => {
    try {
      const resp = await axios.post(
        `/auth/resetMyPassword?token=${token}&pass=${pass}`
      );

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [resetMyPassword];
};

export default useResetPassword;
