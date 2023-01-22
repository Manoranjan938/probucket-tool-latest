package com.tool.ProjectTool.security;

public class SecurityConstants {

	public static final String SIGN_UP_URLS = "/api/auth/**";

	public static final String SECRET = "SecretKeyToGenerateJwts";

	public static final String TOKEN_PREFIX = "Bearer ";

	public static final String TOKEN_HEADER = "Authorization";

	public static final long TOKEN_EXPIRATION_TIME = 18000_000;

}
