import { useState } from "react";
import axios from "shared/services/axios";
import type { NoteListItem } from "features/notes/types";

const useGetNotesList = () => {
  const [notes, setNotes] = useState<NoteListItem[]>([]);

  const getNotesList = async (
    projectId: string | null | undefined,
    userid: string | undefined
  ) => {
    const resp = await axios.get<NoteListItem[]>(`/note/getNoteList/${userid}/${projectId}`);

    setNotes(resp.data);
    return resp;
  };

  return [notes, getNotesList] as const;
};

export default useGetNotesList;
