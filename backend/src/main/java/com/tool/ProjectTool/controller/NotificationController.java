package com.tool.ProjectTool.controller;

import java.util.Collections;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tool.ProjectTool.model.response.ApiResponseBuilder;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "${app.cors.allowed-origin}", allowCredentials = "true")
public class NotificationController {

	@GetMapping("/getNotificationList/{userId}")
	@PreAuthorize("#userId == principal.userId")
	public ResponseEntity<?> getNotificationList(@PathVariable("") String userId){
		
		return ApiResponseBuilder.ok(Collections.emptyList());
	}
	
}
