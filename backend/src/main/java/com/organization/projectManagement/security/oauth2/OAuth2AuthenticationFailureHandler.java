package com.organization.projectManagement.security.oauth2;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.organization.projectManagement.util.CookieUtils;

@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

	HttpCookieOAuth2AuthorizationRequestRepo httpCookieOAuthRequestRepo;

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		
		String targetUrl = CookieUtils.getCookie(request, httpCookieOAuthRequestRepo.REDIRECT_URI_PARAM_COOKIE_NAME)
										.map(Cookie::getValue)
										.orElse(("/"));
		
		targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
						.queryParam("error", exception.getLocalizedMessage())
						.build().toUriString();
		
		httpCookieOAuthRequestRepo.removeAuthorizationRequest(request, response);
		
		getRedirectStrategy().sendRedirect(request, response, targetUrl);
		
	}
	
}