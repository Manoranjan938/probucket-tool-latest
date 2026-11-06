/** model/response/NoteList.java */
export interface NoteListItem {
  id: number;
  title: string;
  description: string;
}

/** model/request/NotesRequest.java */
export interface NotesRequest {
  title: string;
  noteDescription: string;
  userId: string;
  projectId: string;
}
