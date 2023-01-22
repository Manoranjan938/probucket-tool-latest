import axios from "Services/axios";

const useSignUpRequest = () => {
  const register = async (RegisterRequest) => {
    try {
      const res = await axios.post("/auth/newUser", RegisterRequest);

      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  return [register];
};

export default useSignUpRequest;
