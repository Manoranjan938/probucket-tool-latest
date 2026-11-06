import { useLocation } from "react-router-dom";
import { useAppSelector } from "app/hooks";
import { useGetNotesQuery } from "features/notes/api/notesApi";

// The user's notes on the project in the "project" query parameter. The notes page and its list share one cached request.
const useProjectNotes = () => {
  const userId = useAppSelector((state) => state.security.user.id);
  const { search } = useLocation();
  const projectId = new URLSearchParams(search).get("project");

  return useGetNotesQuery({ projectId, userId });
};

export default useProjectNotes;
