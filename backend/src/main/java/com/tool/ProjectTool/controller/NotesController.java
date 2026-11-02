package com.tool.ProjectTool.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tool.ProjectTool.model.request.NotesRequest;
import com.tool.ProjectTool.model.response.ApiResponse;
import com.tool.ProjectTool.model.response.ApiResponseBuilder;
import com.tool.ProjectTool.model.response.NoteDetails;
import com.tool.ProjectTool.model.response.NoteList;
import com.tool.ProjectTool.service.NotesService;

@RestController
@RequestMapping("/api/v1/note")
@CrossOrigin({ "${app.cors.allowed-origin}" })
public class NotesController {

	@Autowired
	private NotesService noteService;

	@PostMapping("/newNote")
	@PreAuthorize("#notesRequest.userId == principal.userId")
	public ResponseEntity<?> createNewNote(@RequestBody NotesRequest notesRequest) {

		return ApiResponseBuilder.created(noteService.createNote(notesRequest));
	}

	@GetMapping("/getNoteList/{userId}/{projectId}")
	@PreAuthorize("#userId == principal.userId")
	public ResponseEntity<ApiResponse<List<NoteList>>> getNoteLists(@PathVariable("userId") String userId,
			@PathVariable("projectId") String projectId) {

		return ApiResponseBuilder.ok(noteService.getAllNotes(projectId, userId));
	}

	@GetMapping("/getNoteDetails/{noteId}")
	public ResponseEntity<ApiResponse<NoteDetails>> getNoteDetails(@PathVariable("noteId") Long id) {

		return ApiResponseBuilder.ok(noteService.getNoteDetails(id));
	}

	@PostMapping("/deleteNote/{noteId}/{userId}")
	@PreAuthorize("#userId == principal.userId")
	public ResponseEntity<?> deleteTask(@PathVariable("noteId") Long id, @PathVariable("userId") String userId) {

		return ApiResponseBuilder.ok(noteService.deleteNote(userId, id));
	}

}
