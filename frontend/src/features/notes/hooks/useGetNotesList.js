import { useState } from "react";
import axios from "Services/axios";

const useGetNotesList = () => {
  const [notes, setNotes] = useState([]);

  const getNotesList = async (projectId, userid) => {
    const resp = await axios.get(`/note/getNoteList/${userid}/${projectId}`);

    setNotes(resp.data);
  };

  return [notes, getNotesList];
};

export default useGetNotesList;
