package com.organization.projectManagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@CrossOrigin("https://localhost:3002")
public class UsersController {
	
	@GetMapping("/me")
	public ResponseEntity<?> getUserDetails(){
		
		return null;
	}

}
