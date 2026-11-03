package com.tool.ProjectTool.config;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.iterableWithSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
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

import com.tool.ProjectTool.controller.ActivityController;
import com.tool.ProjectTool.controller.AuthController;
import com.tool.ProjectTool.controller.ProjectController;
import com.tool.ProjectTool.controller.UserController;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.model.response.RefreshSession;
import com.tool.ProjectTool.security.CustomAuthenticationEntryPoint;
import com.tool.ProjectTool.security.SecurityConstants;
import com.tool.ProjectTool.security.TokenCookieProvider;
import com.tool.ProjectTool.security.TokenProvider;
import com.tool.ProjectTool.service.ActivityService;
import com.tool.ProjectTool.service.CustomUserService;
import com.tool.ProjectTool.service.ProjectService;
import com.tool.ProjectTool.service.RefreshTokenService;
import com.tool.ProjectTool.service.UserService;
import com.tool.ProjectTool.service.ValidationErrorService;

import jakarta.servlet.http.Cookie;

@WebMvcTest({ ActivityController.class, AuthController.class, ProjectController.class, UserController.class })
@Import({ SecurityConfig.class, CustomAuthenticationEntryPoint.class, TokenCookieProvider.class,
		ValidationErrorService.class })
class AccessRulesTest {

	private static final String ORIGIN = "http://localhost:3000";

	private static final String ACCESS_COOKIE = SecurityConstants.ACCESS_TOKEN_COOKIE;

	private static final String REFRESH_COOKIE = SecurityConstants.REFRESH_TOKEN_COOKIE;

	private static final String TOKEN = "signed-token";

	private static final String REFRESH_TOKEN = "refresh-token";

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

	@MockitoBean
	private ActivityService activityService;

	@MockitoBean
	private RefreshTokenService refreshTokenService;

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
	void activityNeedsALogin() throws Exception {
		mockMvc.perform(get("/api/v1/activity/getProjectActivity/AB")).andExpect(status().isUnauthorized());
		mockMvc.perform(get("/api/v1/activity/getTaskActivity/AB-1")).andExpect(status().isUnauthorized());
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
	void loginPutsBothTokensInHttpOnlyCookiesAndNotInTheBody() throws Exception {
		when(authManager.authenticate(any())).thenReturn(loggedIn("ROLE_USER"));
		when(refreshTokenService.startSession("me")).thenReturn(new RefreshSession("me", "session-1", REFRESH_TOKEN));
		when(tokenProvider.generateToken(any(), eq("session-1"))).thenReturn(TOKEN);

		mockMvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
				.content("{\"username\":\"me@example.com\",\"password\":\"x\"}"))
				.andExpect(status().isOk())
				.andExpect(header().stringValues("Set-Cookie", hasItems(
						allOf(containsString(ACCESS_COOKIE + "=" + TOKEN), containsString("HttpOnly"),
								containsString("SameSite=Strict"), containsString("Path=/;")),
						allOf(containsString(REFRESH_COOKIE + "=" + REFRESH_TOKEN), containsString("HttpOnly"),
								containsString("SameSite=Strict"), containsString("Path=/api/v1/auth;")))))
				.andExpect(jsonPath("$.data.id").value("me"))
				.andExpect(jsonPath("$.data.token").doesNotExist());
	}

	@Test
	void theAccessCookieAuthenticatesARequest() throws Exception {
		tokenIsValid();

		mockMvc.perform(get("/api/v1/auth/me").cookie(new Cookie(ACCESS_COOKIE, TOKEN)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.id").value("me"));
	}

	@Test
	void theRefreshCookieDoesNotAuthenticateAnApiRequest() throws Exception {
		tokenIsValid();

		mockMvc.perform(get("/api/v1/auth/me").cookie(new Cookie(REFRESH_COOKIE, TOKEN)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void refreshIsPublicAndReplacesBothCookies() throws Exception {
		tokenIsValid();
		when(refreshTokenService.rotate(REFRESH_TOKEN)).thenReturn(new RefreshSession("me", "session-1", "new-refresh"));
		when(tokenProvider.generateToken(any(), eq("session-1"))).thenReturn("new-access");

		mockMvc.perform(post("/api/v1/auth/refresh").cookie(new Cookie(REFRESH_COOKIE, REFRESH_TOKEN)))
				.andExpect(status().isOk())
				.andExpect(header().stringValues("Set-Cookie", hasItems(
						containsString(ACCESS_COOKIE + "=new-access"),
						containsString(REFRESH_COOKIE + "=new-refresh"))));
	}

	@Test
	void refreshInsideTheGracePeriodLeavesTheRefreshCookieAlone() throws Exception {
		tokenIsValid();
		when(refreshTokenService.rotate(REFRESH_TOKEN)).thenReturn(new RefreshSession("me", "session-1", null));
		when(tokenProvider.generateToken(any(), eq("session-1"))).thenReturn("new-access");

		mockMvc.perform(post("/api/v1/auth/refresh").cookie(new Cookie(REFRESH_COOKIE, REFRESH_TOKEN)))
				.andExpect(status().isOk())
				.andExpect(header().stringValues("Set-Cookie", iterableWithSize(1)))
				.andExpect(header().string("Set-Cookie", containsString(ACCESS_COOKIE + "=new-access")));
	}

	@Test
	void refreshThatFailsEndsTheSessionInTheBrowser() throws Exception {
		mockMvc.perform(post("/api/v1/auth/refresh").cookie(new Cookie(REFRESH_COOKIE, "unusable")))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
				.andExpect(header().stringValues("Set-Cookie", hasItems(
						allOf(containsString(ACCESS_COOKIE + "="), containsString("Max-Age=0")),
						allOf(containsString(REFRESH_COOKIE + "="), containsString("Max-Age=0")))));

		mockMvc.perform(post("/api/v1/auth/refresh"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void theAuthorizationHeaderDoesNotAuthenticate() throws Exception {
		tokenIsValid();

		mockMvc.perform(get("/api/v1/auth/me").header("Authorization", "Bearer " + TOKEN))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
	}

	@Test
	void logoutIsPublicEndsTheSessionAndClearsBothCookies() throws Exception {
		mockMvc.perform(post("/api/v1/auth/logout").cookie(new Cookie(REFRESH_COOKIE, REFRESH_TOKEN)))
				.andExpect(status().isOk())
				.andExpect(header().stringValues("Set-Cookie", hasItems(
						allOf(containsString(ACCESS_COOKIE + "="), containsString("Max-Age=0")),
						allOf(containsString(REFRESH_COOKIE + "="), containsString("Max-Age=0"),
								containsString("Path=/api/v1/auth;")))));

		verify(refreshTokenService).revokeSession(REFRESH_TOKEN);
	}

	@Test
	void logoutEverywhereNeedsALoginAndEndsEverySession() throws Exception {
		mockMvc.perform(post("/api/v1/auth/logoutEverywhere"))
				.andExpect(status().isUnauthorized());
		verify(refreshTokenService, never()).revokeAllSessions(any());

		mockMvc.perform(post("/api/v1/auth/logoutEverywhere").with(authentication(loggedIn("ROLE_USER"))))
				.andExpect(status().isOk())
				.andExpect(header().stringValues("Set-Cookie", iterableWithSize(2)));
		verify(refreshTokenService).revokeAllSessions("me");
	}

	@Test
	void loggedInUserCanActOnTheirOwnAccount() throws Exception {
		when(tokenProvider.getSessionIdFromJwt(TOKEN)).thenReturn("session-1");
		when(userService.updatePassword(any(), eq("session-1"))).thenReturn("Password updated");

		mockMvc.perform(post("/api/v1/user/updatePassword").with(authentication(loggedIn("ROLE_USER")))
				.cookie(new Cookie(ACCESS_COOKIE, TOKEN))
				.contentType(MediaType.APPLICATION_JSON).content("{\"userId\":\"me\",\"password\":\"x\"}"))
				.andExpect(status().isOk());
	}

	@Test
	void loggedInUserCannotActOnSomeoneElsesAccount() throws Exception {
		mockMvc.perform(post("/api/v1/user/updatePassword").with(authentication(loggedIn("ROLE_USER")))
				.cookie(new Cookie(ACCESS_COOKIE, TOKEN))
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
