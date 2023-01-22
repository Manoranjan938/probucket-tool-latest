package com.tool.ProjectTool.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.tool.ProjectTool.entity.Users;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

@Component
public class TokenProvider {

	public String generateToken(Authentication auth) {

		Users user = (Users) auth.getPrincipal();
		Date now = new Date(System.currentTimeMillis());

		Date expiryDate = new Date(now.getTime() + SecurityConstants.TOKEN_EXPIRATION_TIME);
		String id = user.getUserId();

		Map<String, Object> claims = new HashMap<>();
		claims.put("id", user.getUserId());
		claims.put("rolename", user.getRoleName());
		claims.put("username", user.getUsername());
		claims.put("fullName", user.getName());

		return Jwts.builder().setSubject(id).setClaims(claims).setIssuedAt(now).setExpiration(expiryDate)
				.signWith(SignatureAlgorithm.HS512, SecurityConstants.SECRET).compact();

	}

	public boolean validateToken(String token) {
		try {

			Jwts.parser().setSigningKey(SecurityConstants.SECRET).parseClaimsJws(token);
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
		Claims claims = Jwts.parser().setSigningKey(SecurityConstants.SECRET).parseClaimsJws(token).getBody();

		String id = (String) claims.get("id");

		return id;
	}

	public String getRoleFromJwt(String token) {
		Claims claims = Jwts.parser().setSigningKey(SecurityConstants.SECRET).parseClaimsJws(token).getBody();

		String role = (String) claims.get("rolename");

		return role;
	}

}
