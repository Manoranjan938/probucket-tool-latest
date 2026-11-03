package com.tool.ProjectTool.security;

public class SecurityConstants {

	public static final String[] PUBLIC_URLS = {
			"/api/v1/auth/newUser",
			"/api/v1/auth/login",
			// Public so an expired token can still be cleared
			"/api/v1/auth/logout",
			"/api/v1/auth/verify",
			"/api/v1/auth/requestPasswordChange/*",
			"/api/v1/auth/resetMyPassword"
	};

	public static final String TOKEN_COOKIE = "probucket_token";

}
