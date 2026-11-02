package com.tool.ProjectTool.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tool.ProjectTool.model.request.LoginRequest;
import com.tool.ProjectTool.model.request.UserRequest;
import com.tool.ProjectTool.model.response.ApiResponse;
import com.tool.ProjectTool.model.response.ApiResponseBuilder;
import com.tool.ProjectTool.model.response.LoginResponse;
import com.tool.ProjectTool.security.SecurityConstants;
import com.tool.ProjectTool.security.TokenProvider;
import com.tool.ProjectTool.service.UserService;
import com.tool.ProjectTool.service.ValidationErrorService;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin({ "${app.cors.allowed-origin}" })
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
	public ResponseEntity<?> createLocalUser(@Valid @RequestBody UserRequest user, BindingResult result) {

		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if (errorMap != null) {
			return errorMap;
		}

		String user1 = userService.createUser(user);

		return ApiResponseBuilder.created(user1);
	}

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody LoginRequest logRequest) {

		Authentication auth = authManager.authenticate(
				new UsernamePasswordAuthenticationToken(logRequest.getUsername(), logRequest.getPassword()));
		SecurityContextHolder.getContext().setAuthentication(auth);
		String jwt = SecurityConstants.TOKEN_PREFIX + tokenProvider.generateToken(auth);

		return ApiResponseBuilder.ok("Login successful", new LoginResponse(jwt));
	}

	@GetMapping("/verify")
	public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {

		String mess = userService.verifyUser(token);

		return ApiResponseBuilder.ok(mess);
	}

	@GetMapping("/requestPasswordChange/{email}")
	public ResponseEntity<ApiResponse<Void>> requestPasswordChange(@PathVariable("email") String email) {

		String message = userService.requestResetPssword(email);
		return ApiResponseBuilder.ok(message);
	}

	@PostMapping("/resetMyPassword")
	public ResponseEntity<?> updatePassword(@RequestParam("token") String token, @RequestParam("pass") String pass) {

		String message = userService.resetPassword(token, pass);

		return ApiResponseBuilder.ok(message);
	}

}
