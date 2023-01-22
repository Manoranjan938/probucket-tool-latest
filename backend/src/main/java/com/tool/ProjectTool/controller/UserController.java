package com.tool.ProjectTool.controller;

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

import com.tool.ProjectTool.model.request.UpdatePasswordRequest;
import com.tool.ProjectTool.model.request.UpdateUserRequest;
import com.tool.ProjectTool.model.response.UserResponse;
import com.tool.ProjectTool.service.UserService;

@RestController
@RequestMapping("/api/v1/user")
@CrossOrigin({ "https://localhost:3002" })
public class UserController {

	@Autowired
	private UserService userService;
	
	@GetMapping("/me/{email}")
	public ResponseEntity<?> getUserDetails(@PathVariable("email") String email){
		
		UserResponse userDetails = userService.getUserDetails(email);
		
		return new ResponseEntity<UserResponse>(userDetails, HttpStatus.OK);
	}
	
	@PostMapping("/updateMe")
	public ResponseEntity<?> updateUserDetails(@RequestBody UpdateUserRequest updateUser){
		
		String response = userService.updateUser(updateUser);
		
		return  new ResponseEntity<String>(response, HttpStatus.CREATED);
	}
	
	@PostMapping("/updatePassword")
	public ResponseEntity<?> updatePassword(@RequestBody UpdatePasswordRequest passReq){
		
		return new ResponseEntity<String>(userService.updatePassword(passReq), HttpStatus.OK);
	}
	
}
