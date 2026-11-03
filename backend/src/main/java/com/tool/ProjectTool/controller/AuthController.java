package com.tool.ProjectTool.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.model.request.LoginRequest;
import com.tool.ProjectTool.model.request.UserRequest;
import com.tool.ProjectTool.model.response.ApiResponse;
import com.tool.ProjectTool.model.response.ApiResponseBuilder;
import com.tool.ProjectTool.model.response.AuthUserResponse;
import com.tool.ProjectTool.security.TokenCookieProvider;
import com.tool.ProjectTool.security.TokenProvider;
import com.tool.ProjectTool.service.UserService;
import com.tool.ProjectTool.service.ValidationErrorService;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "${app.cors.allowed-origin}", allowCredentials = "true")
public class AuthController {

	@Autowired
	private ValidationErrorService errorService;

	@Autowired
	private UserService userService;

	@Autowired
	private TokenProvider tokenProvider;

	@Autowired
	private TokenCookieProvider tokenCookieProvider;

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
		String jwt = tokenProvider.generateToken(auth);
		AuthUserResponse user = new AuthUserResponse((Users) auth.getPrincipal());

		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, tokenCookieProvider.createCookie(jwt).toString())
				.body(ApiResponseBuilder.ok("Login successful", user).getBody());
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logoutUser() {

		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, tokenCookieProvider.clearCookie().toString())
				.body(ApiResponseBuilder.ok("Logout successful").getBody());
	}

	@GetMapping("/me")
	public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Users user) {

		return ApiResponseBuilder.ok(new AuthUserResponse(user));
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
