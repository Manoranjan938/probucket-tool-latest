package com.organization.projectManagement.security.user;

import java.util.Map;

import com.organization.projectManagement.entity.AuthProvider;
import com.organization.projectManagement.exception.OAuth2AuthenticationProcessingException;


public class OAuth2UserInfoFactory {

public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
		
		if(registrationId.equals(AuthProvider.google.toString())) {
			return new GoogleOAuth2UserInfo(attributes);
		}
		else {
			throw new OAuth2AuthenticationProcessingException("Sorry! Login with " + registrationId + " is not supported yet.");
		}
		
	}
	
}
