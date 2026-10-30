import axios from "shared/services/axios";
import type { NotesRequest } from "features/notes/types";

const useAddNote = () => {
  const createNote = async (noteRequest: NotesRequest) => {
    try {
      const resp = await axios.post<string>("/note/newNote", noteRequest);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [createNote] as const;
};

export default useAddNote;
