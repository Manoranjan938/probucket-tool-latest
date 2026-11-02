package com.tool.ProjectTool.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.tool.ProjectTool.entity.Users;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.PostConstruct;

@Component
public class TokenProvider {

	private static final int HS512_MIN_KEY_BYTES = 64;

	@Value("${app.jwt.secret}")
	private String secret;

	@Value("${app.jwt.expiration-ms}")
	private long expirationTime;

	private SecretKey signingKey;

	@PostConstruct
	void initSigningKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secret);

		if (keyBytes.length < HS512_MIN_KEY_BYTES) {
			throw new IllegalStateException("app.jwt.secret must decode to at least " + HS512_MIN_KEY_BYTES
					+ " bytes, generate one with: openssl rand -base64 64 | tr -d '\\n'");
		}

		signingKey = Keys.hmacShaKeyFor(keyBytes);
	}

	public String generateToken(Authentication auth) {

		Users user = (Users) auth.getPrincipal();
		Date now = new Date(System.currentTimeMillis());

		Date expiryDate = new Date(now.getTime() + expirationTime);

		Map<String, Object> claims = new HashMap<>();
		claims.put("id", user.getUserId());
		claims.put("rolename", user.getRoleName());
		claims.put("username", user.getUsername());
		claims.put("fullName", user.getName());

		return Jwts.builder().claims(claims).issuedAt(now).expiration(expiryDate)
				.signWith(signingKey, Jwts.SIG.HS512).compact();

	}

	public boolean validateToken(String token) {
		try {

			parseClaims(token);
			return true;

		} catch (SignatureException e) {
			System.out.println("Invalid signature.");
		} catch (MalformedJwtException e) {
			System.out.println("Invalid token");
		} catch (ExpiredJwtException e) {
			System.out.println("Expired token");
		} catch (UnsupportedJwtException e) {
			System.out.println("Unsupported token");
		} catch (IllegalArgumentException e) {
			System.out.println("Claims string empty");
		}

		return false;
	}

	public String getUserIdFromJwt(String token) {
		Claims claims = parseClaims(token);

		String id = (String) claims.get("id");

		return id;
	}

	public String getRoleFromJwt(String token) {
		Claims claims = parseClaims(token);

		String role = (String) claims.get("rolename");

		return role;
	}

	private Claims parseClaims(String token) {
		return Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token).getPayload();
	}

}
