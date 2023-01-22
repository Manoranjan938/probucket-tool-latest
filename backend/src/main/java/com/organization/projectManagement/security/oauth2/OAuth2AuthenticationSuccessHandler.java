package com.organization.projectManagement.security.oauth2;

import java.io.IOException;
import java.net.URI;
import java.util.Optional;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.organization.projectManagement.config.AppProperties;
import com.organization.projectManagement.exception.BadRequestException;
import com.organization.projectManagement.security.TokenProvider;
import com.organization.projectManagement.util.CookieUtils;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
	
	private TokenProvider tokenProvider;
	
	private AppProperties appProperties;
	
	private HttpCookieOAuth2AuthorizationRequestRepo authRequestRepo;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		
		String targetUrl = determineTargetUrl(request, response, authentication);
		
		if(response.isCommitted()) {
			
			return;
		}
		
		clearAuthenticationAttributes(request, response);
		getRedirectStrategy().sendRedirect(request, response, targetUrl);
		
	}
	
	protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) {
		
		Optional<String> redirectUri = CookieUtils.getCookie(request, 
				HttpCookieOAuth2AuthorizationRequestRepo.REDIRECT_URI_PARAM_COOKIE_NAME)
				.map(Cookie::getValue);
		
		if(redirectUri.isPresent() && !isAuthorizedRedirectUri(redirectUri.get())) {
			throw new BadRequestException("Sorry! We've got an Unauthorized Redirect URI and can't proceed with the authentication.");
		}
		
		String targetUrl = redirectUri.orElse(getDefaultTargetUrl());
		String token = tokenProvider.generateToken(authentication);
		
		return UriComponentsBuilder.fromUriString(targetUrl)
				.queryParam("token", token)
				.build().toUriString();
		
	}

	private boolean isAuthorizedRedirectUri(String uri) {
		
		URI clientRedirectUri = URI.create(uri);
		
		return appProperties.getOauth2().getAuthorizedRedirectUris()
							.stream()
							.anyMatch(authorizedRedirectURI -> {
								URI authorizedURI = URI.create(authorizedRedirectURI);
								if(authorizedURI.getHost().equalsIgnoreCase(clientRedirectUri.getHost()) && 
										authorizedURI.getPort() == clientRedirectUri.getPort()) {
									return true;
								}
								
								return false;
							});
	}

	private void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
		
		super.clearAuthenticationAttributes(request);
		authRequestRepo.removeAuthorizationRequestCookies(request, response);
		
	}

}
