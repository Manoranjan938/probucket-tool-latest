package com.tool.ProjectTool.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tool.ProjectTool.model.request.NotesRequest;
import com.tool.ProjectTool.model.response.NoteDetails;
import com.tool.ProjectTool.model.response.NoteList;
import com.tool.ProjectTool.service.NotesService;

@RestController
@RequestMapping("/api/v1/note")
@CrossOrigin("https://localhost:3002")
public class NotesController {

	@Autowired
	private NotesService noteService;

	@PostMapping("/newNote")
	public ResponseEntity<?> createNewNote(@RequestBody NotesRequest notesRequest) {

		return new ResponseEntity<String>(noteService.createNote(notesRequest), HttpStatus.CREATED);
	}

	@GetMapping("/getNoteList/{userId}/{projectId}")
	public ResponseEntity<List<NoteList>> getNoteLists(@PathVariable("userId") String userId,
			@PathVariable("projectId") String projectId) {

		return new ResponseEntity<List<NoteList>>(noteService.getAllNotes(projectId, userId), HttpStatus.OK);
	}

	@GetMapping("/getNoteDetails/{noteId}")
	public ResponseEntity<NoteDetails> getNoteDetails(@PathVariable("noteId") Long id) {

		return new ResponseEntity<NoteDetails>(noteService.getNoteDetails(id), HttpStatus.OK);
	}

	@PostMapping("/deleteNote/{noteId}/{userId}")
	public ResponseEntity<?> deleteTask(@PathVariable("noteId") Long id, @PathVariable("userId") String userId) {

		return new ResponseEntity<String>(noteService.deleteNote(userId, id), HttpStatus.OK);
	}

}
