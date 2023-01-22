package com.organization.projectManagement.exception;

import org.springframework.security.core.AuthenticationException;

public class OAuth2AuthenticationProcessingException extends AuthenticationException {

	public OAuth2AuthenticationProcessingException(String msg) {
		super(msg);
	}
	
	public OAuth2AuthenticationProcessingException(String msg, Throwable t) {
        super(msg, t);
    }
	
}