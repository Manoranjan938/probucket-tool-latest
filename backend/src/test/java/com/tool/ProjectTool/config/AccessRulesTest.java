package com.tool.ProjectTool.config;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.tool.ProjectTool.controller.AuthController;
import com.tool.ProjectTool.controller.ProjectController;
import com.tool.ProjectTool.controller.UserController;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.security.CustomAuthenticationEntryPoint;
import com.tool.ProjectTool.security.SecurityConstants;
import com.tool.ProjectTool.security.TokenCookieProvider;
import com.tool.ProjectTool.security.TokenProvider;
import com.tool.ProjectTool.service.CustomUserService;
import com.tool.ProjectTool.service.ProjectService;
import com.tool.ProjectTool.service.UserService;
import com.tool.ProjectTool.service.ValidationErrorService;

import jakarta.servlet.http.Cookie;

@WebMvcTest({ AuthController.class, ProjectController.class, UserController.class })
@Import({ SecurityConfig.class, CustomAuthenticationEntryPoint.class, TokenCookieProvider.class,
		ValidationErrorService.class })
class AccessRulesTest {

	private static final String ORIGIN = "http://localhost:3000";

	private static final String COOKIE = SecurityConstants.TOKEN_COOKIE;

	private static final String TOKEN = "signed-token";

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private AuthenticationManager authManager;

	@MockitoBean
	private CustomUserService customUserService;

	@MockitoBean
	private TokenProvider tokenProvider;

	@MockitoBean
	private UserService userService;

	@MockitoBean
	private ProjectService projectService;

	private Authentication loggedIn(String role) {
		Users user = new Users();
		user.setId(1L);
		user.setUserId("me");
		user.setEmail("me@example.com");
		return new UsernamePasswordAuthenticationToken(user, null, List.of(new SimpleGrantedAuthority(role)));
	}

	private void tokenIsValid() {
		when(tokenProvider.validateToken(TOKEN)).thenReturn(true);
		when(tokenProvider.getUserIdFromJwt(TOKEN)).thenReturn("me");
		when(tokenProvider.getRoleFromJwt(TOKEN)).thenReturn("ROLE_USER");
		when(customUserService.loadUserByUserId("me")).thenReturn((Users) loggedIn("ROLE_USER").getPrincipal());
	}

	@Test
	void anonymousIsRejectedWithTheApiStructureAndCorsHeaders() throws Exception {
		mockMvc.perform(get("/api/v1/project/getProjectDetails/1").header("Origin", ORIGIN))
				.andExpect(status().isUnauthorized())
				.andExpect(header().string("Access-Control-Allow-Origin", ORIGIN))
				.andExpect(jsonPath("$.success").value(false))
				.andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
	}

	@Test
	void signupRoutesArePublic() throws Exception {
		when(userService.requestResetPssword(any())).thenReturn("Email sended");

		mockMvc.perform(get("/api/v1/auth/requestPasswordChange/me@example.com")).andExpect(status().isOk());
		mockMvc.perform(post("/api/v1/auth/newUser").contentType(MediaType.APPLICATION_JSON).content("{}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
	}

	@Test
	void preflightDoesNotNeedAToken() throws Exception {
		mockMvc.perform(options("/api/v1/project/getProjectDetails/1").header("Origin", ORIGIN)
				.header("Access-Control-Request-Method", "GET")
				.header("Access-Control-Request-Headers", "content-type"))
				.andExpect(status().isOk())
				.andExpect(header().string("Access-Control-Allow-Origin", ORIGIN))
				.andExpect(header().string("Access-Control-Allow-Credentials", "true"));
	}

	@Test
	void loginPutsTheTokenInAnHttpOnlyCookieAndNotInTheBody() throws Exception {
		when(authManager.authenticate(any())).thenReturn(loggedIn("ROLE_USER"));
		when(tokenProvider.generateToken(any())).thenReturn(TOKEN);

		mockMvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
				.content("{\"username\":\"me@example.com\",\"password\":\"x\"}"))
				.andExpect(status().isOk())
				.andExpect(header().string("Set-Cookie", allOf(containsString(COOKIE + "=" + TOKEN),
						containsString("HttpOnly"), containsString("SameSite=Strict"), containsString("Path=/"))))
				.andExpect(jsonPath("$.data.id").value("me"))
				.andExpect(jsonPath("$.data.token").doesNotExist());
	}

	@Test
	void theLoginCookieAuthenticatesARequest() throws Exception {
		tokenIsValid();

		mockMvc.perform(get("/api/v1/auth/me").cookie(new Cookie(COOKIE, TOKEN)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.id").value("me"));
	}

	@Test
	void theAuthorizationHeaderDoesNotAuthenticate() throws Exception {
		tokenIsValid();

		mockMvc.perform(get("/api/v1/auth/me").header("Authorization", "Bearer " + TOKEN))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
	}

	@Test
	void logoutIsPublicAndClearsTheCookie() throws Exception {
		mockMvc.perform(post("/api/v1/auth/logout"))
				.andExpect(status().isOk())
				.andExpect(header().string("Set-Cookie", allOf(containsString(COOKIE + "="),
						containsString("Max-Age=0"), containsString("HttpOnly"))));
	}

	@Test
	void loggedInUserCanActOnTheirOwnAccount() throws Exception {
		when(userService.updatePassword(any())).thenReturn("Password updated");

		mockMvc.perform(post("/api/v1/user/updatePassword").with(authentication(loggedIn("ROLE_USER")))
				.contentType(MediaType.APPLICATION_JSON).content("{\"userId\":\"me\",\"password\":\"x\"}"))
				.andExpect(status().isOk());
	}

	@Test
	void loggedInUserCannotActOnSomeoneElsesAccount() throws Exception {
		mockMvc.perform(post("/api/v1/user/updatePassword").with(authentication(loggedIn("ROLE_USER")))
				.contentType(MediaType.APPLICATION_JSON).content("{\"userId\":\"other\",\"password\":\"x\"}"))
				.andExpect(status().isForbidden());
		mockMvc.perform(get("/api/v1/user/me/other@example.com").with(authentication(loggedIn("ROLE_USER"))))
				.andExpect(status().isForbidden());
		mockMvc.perform(get("/api/v1/project/getProjects/other").with(authentication(loggedIn("ROLE_USER"))))
				.andExpect(status().isForbidden());
	}

	@Test
	void roleRulesStillApply() throws Exception {
		mockMvc.perform(get("/api/v1/project/getProjects/me").with(authentication(loggedIn("ROLE_USER"))))
				.andExpect(status().isOk());
		mockMvc.perform(get("/api/v1/project/getProjects/me").with(authentication(loggedIn("ROLE_BOGUS"))))
				.andExpect(status().isForbidden());
	}

}
