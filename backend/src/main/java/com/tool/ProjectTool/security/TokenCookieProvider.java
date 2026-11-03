package com.tool.ProjectTool.security;

import java.time.Duration;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class TokenCookieProvider {

	private static final String ACCESS_COOKIE_PATH = "/";

	@Value("${app.jwt.access-expiration-ms}")
	private long accessExpirationTime;

	@Value("${app.jwt.refresh-expiration-ms}")
	private long refreshExpirationTime;

	@Value("${app.jwt.cookie-secure}")
	private boolean secure;

	public ResponseCookie createAccessCookie(String token) {
		return buildCookie(SecurityConstants.ACCESS_TOKEN_COOKIE, token, ACCESS_COOKIE_PATH,
				Duration.ofMillis(accessExpirationTime));
	}

	public ResponseCookie createRefreshCookie(String token) {
		return buildCookie(SecurityConstants.REFRESH_TOKEN_COOKIE, token, SecurityConstants.REFRESH_COOKIE_PATH,
				Duration.ofMillis(refreshExpirationTime));
	}

	// A max age of zero makes the browser delete a cookie, and its path has to match the one it was set with
	public List<ResponseCookie> clearCookies() {
		return List.of(
				buildCookie(SecurityConstants.ACCESS_TOKEN_COOKIE, "", ACCESS_COOKIE_PATH, Duration.ZERO),
				buildCookie(SecurityConstants.REFRESH_TOKEN_COOKIE, "", SecurityConstants.REFRESH_COOKIE_PATH,
						Duration.ZERO));
	}

	private ResponseCookie buildCookie(String name, String value, String path, Duration maxAge) {
		return ResponseCookie.from(name, value)
				.httpOnly(true)
				.secure(secure)
				.sameSite("Strict")
				.path(path)
				.maxAge(maxAge)
				.build();
	}

}
