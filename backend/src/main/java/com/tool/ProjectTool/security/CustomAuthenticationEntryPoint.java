package com.tool.ProjectTool.security;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.tool.ProjectTool.exception.ApiErrorCode;
import com.tool.ProjectTool.model.response.ApiResponseBuilder;

import tools.jackson.databind.json.JsonMapper;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

	@Autowired
	private JsonMapper jsonMapper;

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException {

		ApiErrorCode code = authException instanceof BadCredentialsException ? ApiErrorCode.INVALID_CREDENTIALS
				: ApiErrorCode.UNAUTHORIZED;

		String jsonRes = jsonMapper.writeValueAsString(ApiResponseBuilder.error(code, "Invalid Credentials").getBody());

		response.setContentType("application/json");
		response.setStatus(401);
		response.getWriter().print(jsonRes);

	}

}
