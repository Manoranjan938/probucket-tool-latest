package com.tool.ProjectTool.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.service.CustomUserService;

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

			if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
				String id = tokenProvider.getUserIdFromJwt(jwt);
				String role = tokenProvider.getRoleFromJwt(jwt);
				
				Collection<SimpleGrantedAuthority> roles = new ArrayList<>();
				SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);
				roles.add(authority);
				
				Users user = customService.loadUserByUserId(id);

				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user, null,
						roles);

				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}

		} catch (Exception e) {
			logger.error("Something went wrong", e);
		}

		filterChain.doFilter(request, response);
		
	}
	
	private String getJWTFromRequest(HttpServletRequest request) {

		String bearer = request.getHeader(SecurityConstants.TOKEN_HEADER);

		if (StringUtils.hasText(bearer) && bearer.startsWith(SecurityConstants.TOKEN_PREFIX)) {

			return bearer.substring(7, bearer.length());
		}

		return null;
	}

}
