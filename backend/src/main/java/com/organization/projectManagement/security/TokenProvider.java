package com.organization.projectManagement.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.organization.projectManagement.entity.User;

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
			
			User user = (User) auth.getPrincipal();
			Date now = new Date(System.currentTimeMillis());
			
			Date expiryDate = new Date(now.getTime() + SecurityConstants.TOKEN_EXPIRATION_TIME);
			
			String userId = Long.toString(user.getId());
			
			Map<String, Object> claims = new HashMap<>();
			claims.put("id", (Long.toString(user.getId())));
			claims.put("username", user.getUsername());
			claims.put("fullName", user.getName());
			
			return Jwts.builder()
						.setSubject(userId)
						.setClaims(claims)
						.setIssuedAt(now)
						.setExpiration(expiryDate)
						.signWith(SignatureAlgorithm.HS512, SecurityConstants.SECRET)
						.compact();
			
		}
	
	public boolean validateToken(String token) {
		try {
			
			Jwts.parser().setSigningKey(SecurityConstants.SECRET).parseClaimsJws(token);
			return true;
			
		}catch(SignatureException e) {
			System.out.println("Invalid signature.");
		}catch(MalformedJwtException e) {
			System.out.println("Invalid token");
		}catch(ExpiredJwtException e) {
			System.out.println("Expired token");
		}catch(UnsupportedJwtException e) {
			System.out.println("Unsupported token");
		}catch(IllegalArgumentException e) {
			System.out.println("Claims string empty");
		}
		
		return false;
	}
	
	public Long getUserIdFromJwt(String token) {
		Claims claims = Jwts.parser()
							.setSigningKey(SecurityConstants.SECRET)
							.parseClaimsJws(token)
							.getBody();
		
		String id = (String) claims.get("id");
		
		return Long.parseLong(id);
	}
	
}
