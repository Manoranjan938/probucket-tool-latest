package com.tool.ProjectTool.security;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class TokenCookieProvider {

	@Value("${app.jwt.expiration-ms}")
	private long expirationTime;

	@Value("${app.jwt.cookie-secure}")
	private boolean secure;

	public ResponseCookie createCookie(String token) {
		return buildCookie(token, Duration.ofMillis(expirationTime));
	}

	// A max age of zero makes the browser delete the cookie
	public ResponseCookie clearCookie() {
		return buildCookie("", Duration.ZERO);
	}

	private ResponseCookie buildCookie(String value, Duration maxAge) {
		return ResponseCookie.from(SecurityConstants.TOKEN_COOKIE, value)
				.httpOnly(true)
				.secure(secure)
				.sameSite("Strict")
				.path("/")
				.maxAge(maxAge)
				.build();
	}

}
