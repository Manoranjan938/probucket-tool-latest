import { api, responseData } from "shared/services/api";
import type { NoteListItem, NotesRequest } from "features/notes/types";
import type { ApiResponse } from "shared/types";

const notesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getNotes: build.query<NoteListItem[], { projectId: string | null; userId: string | undefined }>({
      query: ({ projectId, userId }) => ({ url: `/note/getNoteList/${userId}/${projectId}` }),
      transformResponse: responseData<NoteListItem[]>,
      providesTags: ["Note"],
    }),
    addNote: build.mutation<ApiResponse, NotesRequest>({
      query: (noteRequest) => ({ url: "/note/newNote", method: "POST", data: noteRequest }),
      invalidatesTags: ["Note"],
    }),
  }),
});

export const { useGetNotesQuery, useAddNoteMutation } = notesApi;
