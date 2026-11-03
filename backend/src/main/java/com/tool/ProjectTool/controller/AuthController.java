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
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.ApiErrorCode;
import com.tool.ProjectTool.model.request.LoginRequest;
import com.tool.ProjectTool.model.request.UserRequest;
import com.tool.ProjectTool.model.response.ApiResponse;
import com.tool.ProjectTool.model.response.ApiResponseBuilder;
import com.tool.ProjectTool.model.response.AuthUserResponse;
import com.tool.ProjectTool.model.response.RefreshSession;
import com.tool.ProjectTool.security.SecurityConstants;
import com.tool.ProjectTool.security.TokenCookieProvider;
import com.tool.ProjectTool.security.TokenProvider;
import com.tool.ProjectTool.service.CustomUserService;
import com.tool.ProjectTool.service.RefreshTokenService;
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
	private RefreshTokenService refreshTokenService;

	@Autowired
	private CustomUserService customService;

	@Autowired
	private AuthenticationManager authManager;

	private HttpHeaders sessionCookies(Users user, RefreshSession session) {
		HttpHeaders headers = new HttpHeaders();
		String accessToken = tokenProvider.generateToken(user, session.sessionId());

		headers.add(HttpHeaders.SET_COOKIE, tokenCookieProvider.createAccessCookie(accessToken).toString());
		if (session.refreshToken() != null) {
			headers.add(HttpHeaders.SET_COOKIE, tokenCookieProvider.createRefreshCookie(session.refreshToken()).toString());
		}

		return headers;
	}

	private HttpHeaders clearedCookies() {
		HttpHeaders headers = new HttpHeaders();
		tokenCookieProvider.clearCookies().forEach(cookie -> headers.add(HttpHeaders.SET_COOKIE, cookie.toString()));

		return headers;
	}

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
		Users user = (Users) auth.getPrincipal();
		RefreshSession session = refreshTokenService.startSession(user.getUserId());

		return ResponseEntity.ok()
				.headers(sessionCookies(user, session))
				.body(ApiResponseBuilder.ok("Login successful", new AuthUserResponse(user)).getBody());
	}

	@PostMapping("/refresh")
	public ResponseEntity<?> refreshSession(
			@CookieValue(name = SecurityConstants.REFRESH_TOKEN_COOKIE, required = false) String refreshToken) {

		RefreshSession session = refreshToken != null ? refreshTokenService.rotate(refreshToken) : null;

		if (session == null) {
			return ResponseEntity.status(ApiErrorCode.UNAUTHORIZED.getStatus())
					.headers(clearedCookies())
					.body(ApiResponseBuilder.error(ApiErrorCode.UNAUTHORIZED, "Session ended, please log in again")
							.getBody());
		}

		Users user = customService.loadUserByUserId(session.userId());

		return ResponseEntity.ok()
				.headers(sessionCookies(user, session))
				.body(ApiResponseBuilder.ok("Session refreshed").getBody());
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logoutUser(
			@CookieValue(name = SecurityConstants.REFRESH_TOKEN_COOKIE, required = false) String refreshToken) {

		if (refreshToken != null) {
			refreshTokenService.revokeSession(refreshToken);
		}

		return ResponseEntity.ok()
				.headers(clearedCookies())
				.body(ApiResponseBuilder.ok("Logout successful").getBody());
	}

	@PostMapping("/logoutEverywhere")
	public ResponseEntity<?> logoutEverywhere(@AuthenticationPrincipal Users user) {

		refreshTokenService.revokeAllSessions(user.getUserId());

		return ResponseEntity.ok()
				.headers(clearedCookies())
				.body(ApiResponseBuilder.ok("Logged out on all devices").getBody());
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
