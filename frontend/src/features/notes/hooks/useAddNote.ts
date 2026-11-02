import axios from "shared/services/axios";
import type { NotesRequest } from "features/notes/types";
import type { ApiResponse } from "shared/types";

const useAddNote = () => {
  const createNote = async (noteRequest: NotesRequest) => {
    try {
      const resp = await axios.post<ApiResponse>("/note/newNote", noteRequest);

      return resp;
    } catch (err) {
      throw err;
    }
  };

  return [createNote] as const;
};

export default useAddNote;
