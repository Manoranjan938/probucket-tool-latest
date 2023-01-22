package com.organization.projectManagement.security;

public class SecurityConstants {

	public static final String SIGN_UP_URLS = "/authenticate/**";
	
	public static final String SECRET = "SecretKeyToGenerateJwts";
	
	public static final String TOKEN_PREFIX = "Bearer ";
	
	public static final String TOKEN_HEADER = "Authorization";
	
	public static final long TOKEN_EXPIRATION_TIME = 1800_000;
	
}
