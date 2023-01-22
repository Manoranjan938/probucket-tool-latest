import axios from "Services/axios";

const useAddNote = () => {
  const createNote = async (noteRequest) => {
    try {
      const resp = await axios.post("/note/newNote", noteRequest);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [createNote];
};

export default useAddNote;
