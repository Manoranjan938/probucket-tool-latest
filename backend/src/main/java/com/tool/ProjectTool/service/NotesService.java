package com.tool.ProjectTool.service;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tool.ProjectTool.entity.NotesEntity;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.model.request.NotesRequest;
import com.tool.ProjectTool.model.response.NoteDetails;
import com.tool.ProjectTool.model.response.NoteList;
import com.tool.ProjectTool.repo.NotesRepository;
import com.tool.ProjectTool.repo.UserRepository;

@Service
public class NotesService {

	@Autowired
	private NotesRepository noteRepo;

	private UserRepository userRepo;

	public String createNote(NotesRequest notesRequest) {

		NotesEntity newNote = new NotesEntity();

		newNote.setTitle(notesRequest.getTitle());
		newNote.setNoteDesc(notesRequest.getNoteDescription());
		newNote.setProjectId(notesRequest.getProjectId());
		newNote.setUserId(notesRequest.getUserId());
		newNote.setStatus("Active");

		noteRepo.save(newNote);

		return "Note Added Successfully";
	}

	public List<NoteList> getAllNotes(String projectId, String userId) {

		List<Object> notes = noteRepo.getTaskDetailsByUserAndProjectId(projectId, userId);
		Iterator itr = notes.iterator();
		List<NoteList> noteLists = new ArrayList<>();

		while (itr.hasNext()) {

			Object[] row = (Object[]) itr.next();
			NoteList note = new NoteList();

			note.setId((BigInteger) row[0]);
			note.setDescription(String.valueOf(row[1]));
			note.setTitle(String.valueOf(row[2]));

			noteLists.add(note);

		}

		return noteLists;
	}

	public NoteDetails getNoteDetails(Long id) {

		NotesEntity note = noteRepo.findById(id).get();
		NoteDetails noteExist = new NoteDetails();
		if (note != null) {

			noteExist.setTitle(note.getTitle());
			noteExist.setDescription(note.getNoteDesc());

		}

		return noteExist;
	}

	public String deleteNote(String userId, Long id) {

		NotesEntity note = noteRepo.findById(id).get();
		if (note != null) {

			Users user = userRepo.findByUserId(userId);

			note.setStatus("Deleted");
			note.setDeletedBy(user.getName());
			note.setDeletedDate(new Date());

			noteRepo.save(note);
			return "Task deleted successfully.";
		}

		return null;
	}

}
