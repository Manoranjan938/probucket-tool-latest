package com.tool.ProjectTool.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.tool.ProjectTool.model.response.InvalidLoginResponse;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException {

		InvalidLoginResponse loginRes = new InvalidLoginResponse();

		String jsonRes = new Gson().toJson(loginRes);

		response.setContentType("application/json");
		response.setStatus(401);
		response.getWriter().print(jsonRes);

	}

}
