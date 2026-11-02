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

import com.tool.ProjectTool.model.request.CommentRequest;
import com.tool.ProjectTool.model.response.ApiResponse;
import com.tool.ProjectTool.model.response.ApiResponseBuilder;
import com.tool.ProjectTool.model.response.CommentsList;
import com.tool.ProjectTool.service.CommentsService;

@RestController
@RequestMapping("/api/v1/comment")
@CrossOrigin({ "${app.cors.allowed-origin}" })
public class CommentsController {
	
	@Autowired
	private CommentsService commentService;
	
	@PostMapping("/addComment")
	@PreAuthorize("#commentRequest.userId == principal.userId")
	public ResponseEntity<?> addComment(@RequestBody CommentRequest commentRequest){
		
		return ApiResponseBuilder.created(commentService.addComment(commentRequest));
	}
	
	@GetMapping("/getComments/{taskId}")
	public ResponseEntity<ApiResponse<List<CommentsList>>> getCommentsLists(@PathVariable("taskId") String id){
		
		return ApiResponseBuilder.ok(commentService.getCommetLists(id));
	}

}
