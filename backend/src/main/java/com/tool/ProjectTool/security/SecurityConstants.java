package com.tool.ProjectTool.security;

public class SecurityConstants {

	public static final String[] PUBLIC_URLS = {
			"/api/v1/auth/newUser",
			"/api/v1/auth/login",
			"/api/v1/auth/verify",
			"/api/v1/auth/requestPasswordChange/*",
			"/api/v1/auth/resetMyPassword"
	};

	public static final String TOKEN_PREFIX = "Bearer ";

	public static final String TOKEN_HEADER = "Authorization";

}
