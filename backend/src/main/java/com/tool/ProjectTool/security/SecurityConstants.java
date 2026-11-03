package com.tool.ProjectTool.security;

public class SecurityConstants {

	public static final String[] PUBLIC_URLS = {
			"/api/v1/auth/newUser",
			"/api/v1/auth/login",
			// These two work with the refresh cookie, the access token has usually expired by then
			"/api/v1/auth/refresh",
			"/api/v1/auth/logout",
			"/api/v1/auth/verify",
			"/api/v1/auth/requestPasswordChange/*",
			"/api/v1/auth/resetMyPassword"
	};

	public static final String ACCESS_TOKEN_COOKIE = "probucket_access_token";

	public static final String REFRESH_TOKEN_COOKIE = "probucket_refresh_token";

	// The long-lived token only travels to the auth routes, not with every API request
	public static final String REFRESH_COOKIE_PATH = "/api/v1/auth";

}
