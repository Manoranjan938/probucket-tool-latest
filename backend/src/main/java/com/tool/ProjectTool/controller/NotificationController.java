package com.tool.ProjectTool.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin({ "https://localhost:3002" })
public class NotificationController {

	@GetMapping("/getNotificationList/{userId}")
	public ResponseEntity<?> getNotificationList(@PathVariable("") String userId){
		
		return null;
	}
	
}
