package com.organization.projectManagement.security;

import java.io.IOException;
import java.util.Collections;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.organization.projectManagement.entity.User;
import com.organization.projectManagement.service.CustomUserService;

public class AuthenticationFilter extends OncePerRequestFilter {

	@Autowired
	private TokenProvider tokenProvider;
	
	@Autowired
	private CustomUserService customService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		try {
			
			String jwt = getJWTFromRequest(request);
			
			if(StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
				Long id = tokenProvider.getUserIdFromJwt(jwt);
				
				User user = customService.loadUserById(id);
				
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
							user, null, Collections.emptyList()
						);
				
				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
			
		}catch(Exception e) {
			logger.error("Something went wrong", e);
		}
		
		filterChain.doFilter(request, response);
		
	}
	
	private String getJWTFromRequest(HttpServletRequest request) {
		
		String bearer = request.getHeader(SecurityConstants.TOKEN_HEADER);
		
		if(StringUtils.hasText(bearer) && bearer.startsWith(SecurityConstants.TOKEN_PREFIX)) {
			
			return bearer.substring(7, bearer.length());
		}
		
		return null;
	}
	
}
