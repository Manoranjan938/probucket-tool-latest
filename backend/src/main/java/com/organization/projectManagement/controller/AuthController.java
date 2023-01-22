package com.organization.projectManagement.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.organization.projectManagement.entity.User;
import com.organization.projectManagement.payload.JWTLoginResponse;
import com.organization.projectManagement.payload.LoginRequest;
import com.organization.projectManagement.security.SecurityConstants;
import com.organization.projectManagement.security.TokenProvider;
import com.organization.projectManagement.service.UserService;
import com.organization.projectManagement.service.ValidationErrorService;

@RestController
@RequestMapping("/authenticate")
@CrossOrigin("https://localhost:3002")
public class AuthController {

	@Autowired
	private ValidationErrorService errorService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private TokenProvider tokenProvider;
	
	@Autowired
	private AuthenticationManager authManager;
	
	@PostMapping("/newUser")
	public ResponseEntity<?> createLocalUser(@Valid @RequestBody User user, BindingResult result){
		
		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if(errorMap != null) {
			return errorMap;
		}
		
		User user1 = userService.createUser(user);
		
		return new ResponseEntity<User>(user1, HttpStatus.CREATED);
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest logReq, BindingResult result){
		
		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if(errorMap != null) {
			return errorMap;
		}
		
		Authentication auth = authManager.authenticate(
					new UsernamePasswordAuthenticationToken(logReq.getUsername(), logReq.getPassword())
				);
		
		SecurityContextHolder.getContext().setAuthentication(auth);
		String jwt = SecurityConstants.TOKEN_PREFIX + tokenProvider.generateToken(auth);
		
		return ResponseEntity.ok(new JWTLoginResponse(true, jwt));
	}
	
}
