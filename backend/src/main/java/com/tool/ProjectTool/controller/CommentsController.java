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

import com.tool.ProjectTool.model.request.CommentRequest;
import com.tool.ProjectTool.model.response.CommentsList;
import com.tool.ProjectTool.service.CommentsService;

@RestController
@RequestMapping("/api/v1/comment")
@CrossOrigin({ "https://localhost:3002" })
public class CommentsController {
	
	@Autowired
	private CommentsService commentService;
	
	@PostMapping("/addComment")
	public ResponseEntity<?> addComment(@RequestBody CommentRequest commentRequest){
		
		return new ResponseEntity<String>(commentService.addComment(commentRequest), HttpStatus.CREATED);
	}
	
	@GetMapping("/getComments/{taskId}")
	public ResponseEntity<List<CommentsList>> getCommentsLists(@PathVariable("taskId") String id){
		
		return new ResponseEntity<List<CommentsList>>(commentService.getCommetLists(id), HttpStatus.OK);
	}

}
